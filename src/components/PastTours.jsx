import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

const PastTours = ({ theme }) => {
  const [pastTours, setPastTours] = useState([]);

  useEffect(() => {
    const fetchPastTours = async () => {
      const storedUser = JSON.parse(localStorage.getItem("customer"));
      if (storedUser) {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/customers/${storedUser.id}/past-tours`,
            {
              auth: {
                username: 'user', 
                password: 'password' 
              }
            }
          );
          setPastTours(response.data);
        } catch (error) {
          console.error("Error fetching past tours:", error);
        }
      }
    };
    fetchPastTours();
  }, []);

  return (
    <div className={`app-container ${theme}`}>
      <div className="tours-page">
        <h2>Past Tours</h2>
        <div className="tours-content">
          {pastTours.length > 0 ? (
            <table className="tours-table">
              <thead>
                <tr>
                  <th>Destination</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Booked On</th>
                </tr>
              </thead>
              <tbody>
                {pastTours.map((tour) => (
                  <tr key={tour.id}>
                    <td>{tour.destination}</td>
                    <td>{tour.startDate}</td>
                    <td>{tour.endDate}</td>
                    <td>{tour.status}</td>
                    <td>${tour.price}</td>
                    <td>{tour.bookedOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No past tours.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PastTours;