import React, { useState, useEffect } from "react";
//import EventsDisplay from './eventdisplay';
import EventsAlert from "./displayalert";

function App() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/logs")
      .then((response) => response.json())
      .then((data) => setLogs(data))
      .catch((error) => console.error("Error fetching logs:", error));
  }, []);

  return (
    <div>
      <h1>Suricata Logs</h1>
      <EventsAlert eventsData={logs} />
      {/* <pre>{JSON.stringify(logs, null, 2)}</pre> */}
    </div>
  );
}

export default App;
