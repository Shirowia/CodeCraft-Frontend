import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import logo from '../assets/logo.png';
import '../styles/general.css';

const SkillTree = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

  const [skills, setSkills] = useState([
    {
      name: "Data Structures and Algorithms",
      completed: false,
      subSkills: [
        {
          name: "Data Structures",
          completed: false,
          subSkills: [
            { name: "Arrays", completed: false },
            { name: "Linked Lists", completed: false },
            { name: "Stacks", completed: false },
            { name: "Queues", completed: false },
            { name: "Trees", completed: false },
            { name: "Graphs", completed: false }
          ]
        },
        {
          name: "Algorithms",
          completed: false,
          subSkills: [
            { name: "Sorting", completed: false },
            { name: "Searching", completed: false },
            { name: "Dynamic Programming", completed: false },
            { name: "Greedy Algorithms", completed: false },
            { name: "Backtracking", completed: false }
          ]
        }
      ]
    }
  ]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleCompletionChange = (skillIndex, subSkillIndex, subSubSkillIndex) => {
    const updatedSkills = [...skills];
    if (subSubSkillIndex !== undefined) {
      updatedSkills[skillIndex].subSkills[subSkillIndex].subSkills[subSubSkillIndex].completed =
        !updatedSkills[skillIndex].subSkills[subSkillIndex].subSkills[subSubSkillIndex].completed;
    } else if (subSkillIndex !== undefined) {
      updatedSkills[skillIndex].subSkills[subSkillIndex].completed =
        !updatedSkills[skillIndex].subSkills[subSkillIndex].completed;
    } else {
      updatedSkills[skillIndex].completed = !updatedSkills[skillIndex].completed;
    }
    setSkills(updatedSkills);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="d-flex vh-100">
      <div className={`bg-dark text-white p-3 d-flex flex-column ${isSidebarOpen ? 'd-block' : 'd-none'}`} style={{ width: '250px' }}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" height="50" />
          <h4 className="mt-2">CodeCraft</h4>
        </div>
        <ul className="nav flex-column flex-grow-1">
          <li className="nav-item"><Link className="nav-link text-white" to="/menu">Menu</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/profile">Profile</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/daily-challenge">Daily Challenges</Link></li>
          <li className="nav-item"><Link className="nav-link text-white active" to="/skilltree">Skill Tree</Link></li>
          <li className="nav-item"><Link className="nav-link text-white" to="/learn">Learn</Link></li>
          <li className="nav-item"><Link className="nav-link text-white active" to="/communities">Communities</Link></li>
        </ul>

        <ul className="nav flex-column">
          <li className="nav-item mt-auto"><Link to="/settings"><button className="btn btn-outline-light game-menu-button w-100">Settings</button></Link></li>
          <li className="nav-item"><button className="btn btn-danger w-100 mt-3 game-menu-button" onClick={handleLogout}>Logout</button></li>
        </ul>
      </div>

      <div className="flex-grow-1 p-4">
        <button className="btn btn-primary mb-3" onClick={toggleSidebar}>
          {isSidebarOpen ? 'Hide Menu' : 'Show Menu'}
        </button>
        <h2>Skill Tree</h2>
        <hr />
        <ul className="list-group skilltree-list">
          {skills.map((skill, skillIndex) => (
            <li key={skillIndex} className="bg-dark list-group-item skill-item">
              <div className="skill-header">
                <input
                  type="checkbox"
                  checked={skill.completed}
                  onChange={() => handleCompletionChange(skillIndex)}
                  className="form-check-input skill-checkbox"
                />
                <span className="skill-name">{skill.name}</span>
              </div>
              <ul className="list-group subskill-list">
                {skill.subSkills.map((subSkill, subSkillIndex) => (
                  <li key={subSkillIndex} className="bg-dark list-group-item subskill-item">
                    <div className="subskill-header">
                      <input
                        type="checkbox"
                        checked={subSkill.completed}
                        onChange={() => handleCompletionChange(skillIndex, subSkillIndex)}
                        className="form-check-input subskill-checkbox"
                      />
                      <span className="subskill-name">{subSkill.name}</span>
                    </div>
                    <ul className="list-group subsubskill-list">
                      {subSkill.subSkills.map((subSubSkill, subSubSkillIndex) => (
                        <li key={subSubSkillIndex} className="bg-dark list-group-item subsubskill-item">
                          <div className="subsubskill-header">
                            <input
                              type="checkbox"
                              checked={subSubSkill.completed}
                              onChange={() => handleCompletionChange(skillIndex, subSkillIndex, subSubSkillIndex)}
                              className="form-check-input subsubskill-checkbox"
                            />
                            <span className="subsubskill-name">{subSubSkill.name}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SkillTree;