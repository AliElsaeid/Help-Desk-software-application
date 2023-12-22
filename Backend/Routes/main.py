from fastapi import FastAPI, HTTPException,Depends
from pydantic import BaseModel
from pymongo import MongoClient
from bson import ObjectId
import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from queue import Queue
import traceback  
import os  # Import the os module
from dotenv import load_dotenv






app = FastAPI()
load_dotenv()  # Take environment variables from .env.

mongo_uri = os.getenv("ATLAS_URI")

# Check if the MONGODB_ATLAS_URI is set in the environment variables
if not mongo_uri:
    raise Exception("MONGODB_ATLAS_URI environment variable is not set")

client = MongoClient(mongo_uri)
db = client["test"]
tickets_collection = db["tickets"]
users_collection = db["users"]



class TicketData(BaseModel):
    ticket_id: str 

class UserData(BaseModel):
    user_id: str   




def train_classifier(df):

    encoder = OneHotEncoder(handle_unknown='ignore')
    X = encoder.fit_transform(df[['Priority', 'Type']])

    y = df['Agent']

    classifier = RandomForestClassifier(n_jobs=-1)
    classifier.fit(X, y)

    return classifier, encoder


def get_assignment_probabilities(Type, Priority, classifier, encoder):
    new_ticket_encoded = encoder.transform(pd.DataFrame({'Priority': [Priority], 'Type': [Type]}))
    probabilities = classifier.predict_proba(new_ticket_encoded)

    results = {}
    for i, agent in enumerate(classifier.classes_):
        results[agent] = probabilities[0, i]

    return results





def get_ticket_data(ticket_id: str):
    try:
        ticket_data = tickets_collection.find_one({"_id": ObjectId(ticket_id)})
        
        if ticket_data:
            return {
                "_id": str(ticket_data["_id"]), 
            
                "priority": ticket_data["priority"],
                "category": ticket_data["category"],
            }
        else:
            raise HTTPException(status_code=404, detail="Ticket not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


df = pd.read_csv('../assets/Dataset for Extrafeature.csv')
classifier, encoder = train_classifier(df)


import traceback  # Import the traceback module

@app.post("/predict_assignment")
async def predict_assignment():
    try:
        
       
         

        agents = ["Agent 1", "Agent 2", "Agent 3"]

        agent_queues = {agent: Queue(maxsize=5) for agent in agents}
        big_queue = Queue()

        open_tickets = tickets_collection.find({"status": "open"})
        for open_ticket in open_tickets:
            big_queue.put(open_ticket.get("_id"))


      

        pending_tickets = tickets_collection.find({"status": "pending"})

        for pending_ticket in pending_tickets:
            agent_id = pending_ticket.get("agent")

            if agent_id:
                agent = users_collection.find_one({"_id": ObjectId(agent_id)})

                if agent:
                    agent_username = agent.get("username")
                    agent_queues[agent_username].put(pending_ticket.get("_id"))
                    print(f"Agent Username for Ticket: {agent_username}")
                else:
                    print(f"Agent not found for Ticket")
            else:
                print(f"No agent assigned for Ticket")

        for agent_name, agent_queue in agent_queues.items():
            print(f"{agent_name}'s Queue: {list(agent_queue.queue)}")

        queue_size = big_queue.qsize()

        for i in range(queue_size):
            ticket_ids = big_queue.get()
            print(ticket_ids)
            ticket_data_mngo = get_ticket_data(ticket_id=ticket_ids)
            result = get_assignment_probabilities(
                ticket_data_mngo['category'],
                ticket_data_mngo['priority'],
                classifier,
                encoder
            )
            agent_name = max(result, key=lambda k: result[k])
            print(agent_name)

            if agent_name in agents:
                agent_queue = agent_queues[agent_name]

                if not agent_queue.full():
                    agent_queue.put(ticket_data_mngo["_id"])
                    ag = users_collection.find_one({"username": agent_name})
                    ag_id = ag.get("_id")
                    print(ticket_data_mngo["_id"])
                    tickets_collection.update_one(
                        {"_id": ObjectId(ticket_data_mngo["_id"])},
                        {
                            "$set": {
                                "status": "pending",
                                "agent": ObjectId(ag_id)
                            }
                        }
                    )
                    print(f"Ticket added to {agent_name}'s queue.")
                    break

            # Check the second highest agent
            second_highest_agent = sorted(result.keys(), key=lambda k: result[k], reverse=True)[1]
            if second_highest_agent in agents:
                second_highest_agent_queue = agent_queues[second_highest_agent]

                # Check if there is empty space in the second highest agent's queue
                if not second_highest_agent_queue.full():
                   
                    second_highest_agent_queue.put(ticket_data_mngo["_id"])
                    ag = users_collection.find_one({"username": second_highest_agent})
                    ag_id = ag.get("_id")
                    tickets_collection.update_one(
                        {"_id": ObjectId(ticket_data_mngo["_id"])},
                        {
                            "$set": {
                                "status": "pending",
                                "agent": ObjectId(ag_id)
                            }
                        }
                    )
                    print(f"Ticket added to {second_highest_agent}'s queue.")
                    break



            
            third_highest_agent = sorted(result.keys(), key=lambda k: result[k], reverse=True)[2]
            if third_highest_agent in agents:
                third_highest_agent_queue = agent_queues[third_highest_agent]

                if not third_highest_agent_queue.full():
                    
                    third_highest_agent_queue.put(ticket_data_mngo["_id"])
                    ag = users_collection.find_one({"username": third_highest_agent})
                    ag_id = ag.get("_id")
                    tickets_collection.update_one(
                        {"_id": ticket_data_mngo["_id"]},
                        {
                            "$set": {
                                "status": "pending",
                                "agent": ag_id
                            }
                        }
                    )
                    print(f"Ticket added to {third_highest_agent}'s queue.")
                    break

            else:
                big_queue.put(ticket_data_mngo["_id"])
                print("Ticket added to big queue.")
                
        return {"message": "ticket is assigned."}        

    except Exception as e:
        print(f"Error: {e}")
        # Print the traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")

