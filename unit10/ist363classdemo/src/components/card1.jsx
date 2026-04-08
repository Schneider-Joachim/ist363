const person = {
  name: "Schneider J",
  year: "Senior",
  major: "Data Analytics",
};

function Card1() {
  return (
    <div className="card">
      <h2>Student Info</h2>
      <ul>
        <li>Name: {person.name}</li>
        <li>Year: {person.year}</li>
        <li>Major: {person.major}</li>
      </ul>
    </div>
  );
}

export default Card1;
