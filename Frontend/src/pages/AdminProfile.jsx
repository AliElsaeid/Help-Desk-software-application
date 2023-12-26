import "../stylesheets/Adminprofile.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Don't forget to import css
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import Avatar from '@mui/material/Avatar';
import Adminnavbar from '../components/Adminnavbar';




const userbackend = "http://localhost:3000/api/v1/user";
const ticketbackend = "http://localhost:3000/api/v1/ticket";
const appbackend="http://localhost:3000/api/v1/appearance";

function TicketDetails({ ticket ,onClose }) {

  const [status, setStatus] = useState('');
  const [resolution, setResolution] = useState('');
  const [cookies] = useCookies(['token']);
  const [emailSending, setEmailSending] = useState(false);

  // Since we're not getting a single ticket detail, we no longer need an effect hook here
  // Remove the previous useEffect that fetched ticket details

  const updateTicket = () => {
    const dataToSend = {
      status: status,
      resolution: resolution
    };
console.log(ticket);
    const config = {
      headers: { 'Authorization': `Bearer ${cookies.token}` }
    };

    axios.put(`${ticketbackend}/${ticket._id}`, dataToSend, config)
    .then(response => {
      toast.success("Ticket updated successfully");
      // Use 'window.location.reload()' to reload the page after the update.
      // window.location.reload();
    })
    .catch(error => {
      console.error('Error updating ticket:', error);
      toast.error("Failed to update ticket.");
    });

  };
  const sendResolutionEmail = () => {
    setEmailSending(true); // Set state to represent email-sending progress
    const emailData = {
      userId: ticket.user,
      subject: 'Your Ticket Resolution',
      message: resolution
    };

    // Set up your headers and tokens correctly.
    const config = {
      headers: { 'Authorization': `Bearer ${cookies.token}` }
    };

    axios.post('http://localhost:3000/api/v1/communication/sendEmail', emailData, config)
      .then(response => {
        toast.success("Email sent successfully!");
        setEmailSending(false); 

      })
      .catch(error => {
        console.error('Error sending resolution email:', error);
        toast.error("Failed to send email.");
        setEmailSending(false);
      });
  };

  

  return (
    <div className="update-ticket-card">
 <button className="btn btn-sm btn-danger close-btn" onClick={onClose}>
  Close
</button>
<h2>Update Ticket: {ticket.description}</h2>
<div>
  <label>Status:</label>
  <select value={status} onChange={(e) => setStatus(e.target.value)}>
    <option value="open">Open</option>
    <option value="pending">Pending</option>
    <option value="closed">Closed</option>
  </select>
</div>
<div>
  <label>Resolution:</label>
  <textarea
    className="resolution-textarea"
    value={resolution}
    onChange={(e) => setResolution(e.target.value)}
    rows="8" /* Set the number of visible rows */
  ></textarea>
</div>
<div>
  <button className="btn btn-primary update-btn" onClick={() => updateTicket()}>
    Update Ticket
  </button>
  <button
    className="btn btn-secondary email-btn"
    onClick={sendResolutionEmail}
    disabled={emailSending}
  >
    Send Resolution Email
  </button>
</div>

</div>

   
    
  );
}
const AdminProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [cookies] = useCookies([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
 
  const [textColor, setTextColor] = useState('#000000');
  const [textStyle, setTextStyle] = useState('normal');

  const [averageRatingsByAgent, setAverageRatingsByAgent] = useState([]);
  const [isTicketDetailsVisible, setTicketDetailsVisible] = useState(false);

  const openTicketDetails = (ticket) => {
    setSelectedTicketId(ticket);
    setTicketDetailsVisible(true);
  };

  const closeTicketDetails = () => {
    setTicketDetailsVisible(false);
    setSelectedTicketId(null);
  };



  // If you need to use the value


 
  useEffect(() => {
    axios.defaults.withCredentials = true;
    const uid = localStorage.getItem("userId");
    axios.get(`${appbackend}/appearance`)
    .then((response) => {
        const settings = response.data;

        setTextColor(settings.textColor);
        setTextStyle(settings.textStyle);

        // Apply the current appearance settings to the document body
        document.body.style.color = settings.textColor;
        document.body.style.fontStyle = settings.textStyle;
    })
    .catch((error) => {
        console.error('Error fetching appearance settings:', error);
    });


    // Fetch user details using the user ID from useParams
    axios.get(`${userbackend}/${uid}`, { withCredentials: true })
      .then(response => setUser(response.data))
      .catch(error => {
        console.error('Error fetching user:', error);
        toast.error("Error fetching user details.");
      });

    axios.get(`${ticketbackend}/getTickets`, {
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${cookies.token}`
      }
    })
    .then(response => setTickets(response.data))
    .catch(error => {
      console.error('Error fetching tickets:', error);
      toast.error("Error fetching tickets.");
    });

    const fetchRatingsAndCalculateAverages = async () => {
        try {
          // Fetch the ratings from the API
          const response = await axios.get('http://localhost:3000/api/v1/report/ratings', {
            headers: { Authorization: `Bearer ${cookies.token}` }
          });
  
          const { ratings } = response.data;
  
          const ratingsGroupedByAgent = ratings.reduce((acc, currRating) => {
            const agent = currRating.agent;
            if (!acc[agent]) {
              acc[agent] = [];
            }
            acc[agent].push(currRating.rating);
            return acc;
          }, {});
  
          const averageRatings = Object.keys(ratingsGroupedByAgent).map((agent) => {
            const ratingsForAgent = ratingsGroupedByAgent[agent];
            const sumRatings = ratingsForAgent.reduce((acc, curr) => acc + curr, 0);
            const averageRating = sumRatings / ratingsForAgent.length;
            return { agent, averageRating };
          });
  
          setAverageRatingsByAgent(averageRatings);
        } catch (error) {
          console.error('Error fetching ratings:', error);
          toast.error("Error fetching ratings.");
        }
      };
  
      fetchRatingsAndCalculateAverages();

    
  }, [id, cookies.token]);
  const updateAppearance = async () => {
    try {
      const response = await axios.put(`${appbackend}/appearance`, {
        textColor,
        textStyle
    }, {
        headers: { 'Authorization': `Bearer ${cookies.token}` }
    });

    // Apply the updated appearance settings to the document body
    document.body.style.color = textColor;
    document.body.style.fontStyle = textStyle;

    toast.success('Appearance settings updated successfully');
} catch (error) {
    console.error('Error updating appearance settings:', error);
    toast.error('Failed to update appearance settings.');
}
};

  const barChartData = {
    labels: averageRatingsByAgent.map(r => r.agent), // Agents' names/IDs as labels
    datasets: [
      {
        label: 'Average Rating',
        data: averageRatingsByAgent.map(r => r.averageRating), // Average rating values
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };


  


  return (
    <div>
         <div className="navbar-top-right">
      <Adminnavbar />
     </div>
      <div className="user-inf-container">
  {user && (
    <div className="user-etails">
           <Avatar className="user-avatar" alt={user.username} src={user.avatarUrl} />

      <div className="user-nfo">
        <h1>{user.username}</h1>
        <p>{user.email}</p>
      </div>
    </div>
  )}
</div>

<div className="ticket-lis-container">
  <h1>Ticket List</h1>
  <ul>
    {tickets.map((ticket) => (
            <li key={ticket._id} onClick={() => openTicketDetails(ticket)}>
            <span>Category: {ticket.category}</span>
        <span>SubCategory: {ticket.subCategory}</span>
        <span>Description: {ticket.description}</span>
        <span>Resolution: {ticket.resolution}</span>
        <span>Created At: {ticket.createdAt}</span>
        <span>Updated At: {ticket.updatedAt}</span>
        <span>Closed At: {ticket.closedAt}</span>
        <span>Status: {ticket.status}</span>
      </li>
    ))}
  </ul>
</div>
<div className="ticket-detail-view">
{isTicketDetailsVisible && (
          <TicketDetails ticket={selectedTicketId} onClose={closeTicketDetails} />
        )}
      </div>
      <div className="appearance-settings">
        <h2>Appearance Settings</h2>
        <div>
            <label>Text Color:</label>
            <select
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
            >
                <option value="#FFFFFF">White</option>
                <option value="#000000">Black</option>
                <option value="#008000">Green</option>
                <option value="#800080">Purple</option>
                <option value="#fe016d">Pink</option>
                {/* Add more color options as needed */}
            </select>
        </div>
        <div>
            <label>Text Style:</label>
            <select
                value={textStyle}
                onChange={(e) => setTextStyle(e.target.value)}
            >
                <option value="normal">Normal</option>
                <option value="italic">Italic</option>
                {/* Add more text style options as needed */}
            </select>
        </div>
        <button onClick={updateAppearance}>Update Appearance</button>
    </div>

    {averageRatingsByAgent.length > 0 ? (
  <div className="bar-chart-container">
    <h2>Average Agent Ratings</h2>
    <Bar data={barChartData} />
  </div>
) : (
  <p>No ratings data available to display chart.</p>
)}
    </div>
    
  );
};

export default AdminProfile;