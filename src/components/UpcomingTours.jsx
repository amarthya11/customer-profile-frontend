import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import PropTypes from 'prop-types';

const UpcomingTours = ({ theme }) => {
  const [upcomingTours, setUpcomingTours] = useState([]);

  useEffect(() => {
    const fetchUpcomingTours = async () => {
      const storedUser = JSON.parse(localStorage.getItem("customer"));
      if (storedUser) {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/customers/${storedUser.id}/upcoming-tours`,
            {
              auth: {
                username: 'user', 
                password: 'password' 
              }
            }
          );
          setUpcomingTours(response.data);
        } catch (error) {
          console.error("Error fetching upcoming tours:", error);
        }
      }
    };
    fetchUpcomingTours();
  }, []);

  return (
    <div className={`app-container ${theme}`}>
      <div className="tours-page">
        <h2>Upcoming Tours</h2>
        <div className="tours-content">
          {upcomingTours.length > 0 ? (
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
                {upcomingTours.map((tour) => (
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
            <p>No upcoming tours.</p>
          )}
        </div>
      </div>
    </div>
  );
};
UpcomingTours.propTypes = {
  theme: PropTypes.string.isRequired
};

export default UpcomingTours;