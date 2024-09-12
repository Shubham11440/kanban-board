import React, { useState, useEffect } from "react";
import "./KanbanBoard.css";

const API_URL = "https://api.quicksell.co/v1/internal/frontend-assignment";

function KanbanBoard() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [grouping, setGrouping] = useState("status");
  const [sortOption, setSortOption] = useState("priority");
  const [displayMenu, setDisplayMenu] = useState(false);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setTickets(data.tickets);
        setUsers(data.users);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const groupTickets = () => {
    switch (grouping) {
      case "status":
        return groupBy("status");
      case "user":
        return groupBy("userId");
      case "priority":
        return groupBy("priority");
      default:
        return groupBy("status");
    }
  };



  const getPriorityName = (priority) => {
    switch (priority) {
      case 4:
        return "Urgent";
      case 3:
        return "High";
      case 2:
        return "Medium";
      case 1:
        return "Low";
      case 0:
        return "No Priority";
      default:
        return "Unknown Priority";
    }
  };

  const groupBy = (key) => {
    return tickets.reduce((acc, ticket) => {
      const groupKey = ticket[key];
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(ticket);
      return acc;
    }, {});
  };

  const sortedTickets = (group) => {
    return group.sort((a, b) => {
      if (sortOption === "priority") {
        return b.priority - a.priority;
      } else if (sortOption === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  return (
    <div className="kanban-board">


      <div className="controls">
        <button
          className="display-button"
          onClick={() => setDisplayMenu(!displayMenu)}
        >
          Display
        </button>

        {displayMenu && (
          <div className="display-menu">
            <div className="dropdown-group">
              <span>Grouping:</span>
              <div className="dropdown">
                <button className="dropdown-button">{grouping}</button>
                <div className="dropdown-content">
                  <button onClick={() => setGrouping("status")}>Status</button>
                  <button onClick={() => setGrouping("user")}>User</button>
                  <button onClick={() => setGrouping("priority")}>
                    Priority
                  </button>
                </div>
              </div>
            </div>

            <div className="dropdown-group">
              <span>Ordering:</span>
              <div className="dropdown">
                <button className="dropdown-button">{sortOption}</button>
                <div className="dropdown-content">
                  <button onClick={() => setSortOption("priority")}>
                    Priority
                  </button>
                  <button onClick={() => setSortOption("title")}>Title</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="board">
        {Object.entries(groupTickets()).map(([groupKey, group]) => (
          <div key={groupKey} className="column">
            <div className="column-header">
              <h3>
                {grouping === "priority"
                  ? getPriorityName(parseInt(groupKey))
                  : grouping === "user"
                  ? getUserName(groupKey)
                  : groupKey}
              </h3>
              <span>{group.length} tasks</span>
            </div>
            {sortedTickets(group).map((ticket) => (
              <div key={ticket.id} className="task-card">
                <p> {ticket.id}</p>
                <h4 className="task-title">{ticket.title}</h4>
                <p> {ticket.tag}</p>
                {/* <img src={getImagePath(ticket.tag)} alt={ticket.tag} className="task-image" /> */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default KanbanBoard;
