// #1
const students = [
  { suid: 123456, name: 'Sue Flay', year: 'senior', major: 'Applied Data Analytics' },
  { suid: 234567, name: 'Ella Vader', year: 'junior', major: 'Information Management and Technology' },
  { suid: 345678, name: 'Chris P Bacon', year: 'junior', major: 'Innovation, Society and Technology' }
];

function App() {
  return (
    <div>
      <h1>Student List</h1>
      <ul>
        {students.map((student) => (
          <li>
            {student.name} - {student.year} - {student.major}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

// #2
const students = [
  { suid: 123456, name: 'Sue Flay', year: 'senior', major: 'Applied Data Analytics' },
  { suid: 234567, name: 'Ella Vader', year: 'junior', major: 'Information Management and Technology' },
  { suid: 345678, name: 'Chris P Bacon', year: 'junior', major: 'Innovation, Society and Technology' }
];

function App() {
  return (
    <div>
      <h1>Student List</h1>
      <ul>
        {students.map((student) => (
          <li key={student.suid}>
            {student.name} - {student.year} - {student.major}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

// #3
const students = [
  { suid: 123456, name: 'Sue Flay', year: 'senior', major: 'Applied Data Analytics' },
  { suid: 234567, name: 'Ella Vader', year: 'junior', major: 'Information Management and Technology' },
  { suid: 345678, name: 'Chris P Bacon', year: 'junior', major: 'Innovation, Society and Technology' }
];

function Students() {
  return (
    <ul>
      {students.map((student) => (
        <li key={student.suid}>
          {student.name} - {student.year} - {student.major}
        </li>
      ))}
    </ul>
  );
}

function App() {
  return (
    <div>
      <h1>Student List</h1>
      <Students />
    </div>
  );
}

export default App;

// #4
function App() {
  const handleClick = (message) => {
    console.log(message);
  };

  return (
    <div>
      <button onClick={() => handleClick("Button was clicked!")}>
        Click Me
      </button>
    </div>
  );
}

export default App;

// #5
const students = [
  { suid: 123456, name: 'Sue Flay', year: 'senior', major: 'Applied Data Analytics' },
  { suid: 234567, name: 'Ella Vader', year: 'junior', major: 'Information Management and Technology' },
  { suid: 345678, name: 'Chris P Bacon', year: 'junior', major: 'Innovation, Society and Technology' }
];

function App() {
  const filteredStudents = students.filter(
    (student) => student.name === "Sue Flay"
  );

  return (
    <div>
      <h1>Filtered Students</h1>
      <ul>
        {filteredStudents.map((student) => (
          <li key={student.suid}>
            {student.name} - {student.year} - {student.major}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
