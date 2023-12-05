from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
from bson import ObjectId
import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier

app = FastAPI()

mongo_uri = "mongodb://localhost:27017"
client = MongoClient(mongo_uri)
db = client["Help_Desk"]
tickets_collection = db["tickets"]


class TicketData(BaseModel):
    ticket_id: str 


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
                "_id": str(ticket_data["_id"]),  # Convert ObjectId to string
                "priority": ticket_data["priority"],
                "category": ticket_data["category"],
            }
        else:
            raise HTTPException(status_code=404, detail="Ticket not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


df = pd.read_csv('../assets/Dataset for Extrafeature.csv')
classifier, encoder = train_classifier(df)


@app.post("/predict_assignment")
async def predict_assignment(ticket_data: TicketData):
    try:
        ticket_data_mongo = get_ticket_data(ticket_id=ticket_data.ticket_id)

        result = get_assignment_probabilities(
            ticket_data_mongo['category'],
            ticket_data_mongo['priority'],
            classifier,
            encoder
        )
        return result
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
