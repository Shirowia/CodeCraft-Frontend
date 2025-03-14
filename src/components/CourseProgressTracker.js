import React from 'react';
import CircularProgress from './CircularProgress';
import '../styles/progress.css';

const CourseProgressTracker = ({ overallProgress, courseProgress }) => {
  // Get top courses by progress
  const getTopCourses = () => {
    return Object.entries(courseProgress)
      .sort(([, a], [, b]) => (b.progressPercentage || 0) - (a.progressPercentage || 0))
      .slice(0, 3)
      .map(([id, course]) => ({
        id,
        progress: course.progressPercentage || 0,
        completed: course.completed || false
      }));
  };

  const topCourses = getTopCourses();
  
  // Calculate completed courses count
  const completedCoursesCount = Object.values(courseProgress)
    .filter(course => course.completed).length;
  
  const totalCourses = Object.keys(courseProgress).length;

  return (
    <div className="course-progress-tracker">
      <div className="progress-overview">
        <div className="main-progress">
          <CircularProgress 
            percentage={overallProgress} 
            size={100} 
            strokeWidth={8}
            color="#2196f3" 
          />
        </div>
        
        <div className="course-stats text-center mt-2 mb-3">
          <small className="text-muted">
            {completedCoursesCount} of {totalCourses} courses completed
          </small>
        </div>
        
        {topCourses.length > 0 && (
          <div className="top-courses">
            <div className="progress-categories">
              {topCourses.map((course, index) => (
                <div key={index} className="category-progress-item">
                  <CircularProgress 
                    percentage={course.progress} 
                    size={60}
                    strokeWidth={5}
                    color={course.completed ? "#4caf50" : "#ff9800"}
                  />
                  <p className="mini-progress-label">{course.id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseProgressTracker;
