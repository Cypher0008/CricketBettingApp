const Scorecard = ({ data }) => {
  if (!data) return <p>No scorecard data available.</p>;

  const emptyRow = {
    name: '-',
    runs: '-',
    balls: '-',
    fours: '-',
    sixes: '-',
    strike_rate: '-',
    dismissal: '-',
  };

  const renderTable = (team, teamName) => (
    <div className="scorecard-section">
      <h3>{teamName}</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Runs</th>
            <th>Balls</th>
            <th>Fours</th>
            <th>Sixes</th>
            <th>Strike Rate</th>
            <th>Dismissal</th>
          </tr>
        </thead>
        <tbody>
          {(team?.length ? team : [emptyRow]).map((player, index) => (
            <tr key={index}>
              <td>{player.name || '-'}</td>
              <td>{player.runs || '-'}</td>
              <td>{player.balls || '-'}</td>
              <td>{player.fours || '-'}</td>
              <td>{player.sixes || '-'}</td>
              <td>{player.strike_rate || '-'}</td>
              <td>{player.dismissal || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      {data.home_team && renderTable(data.home_team, data.home_team_name)}
      {data.away_team && renderTable(data.away_team, data.away_team_name)}
    </div>
  );
};

export default Scorecard;
