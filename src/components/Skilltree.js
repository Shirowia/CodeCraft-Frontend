import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import Navigation from './Navigation';
import '../styles/general.css';

const SkillTree = () => {
  const navigate = useNavigate();
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

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

  return (
    <div className="d-flex vh-100">
      <Navigation handleLogout={handleLogout} />
      <div className="flex-grow-1 p-4">
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