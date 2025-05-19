import React from 'react';
import '../components/styles/Policy.css';;

const Policy = () => {
  const handleDownload = () => {
    const pdfUrl = '/public/Student Development Policy A.Y 2024-25.pdf'; 
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'Student_Development_Policy_A.Y_2024-25.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="policy-container">
      <h1>STUDENT DEVELOPMENT POLICY</h1>
      <h2>Applicable to UG, PG, and Ph.D. from Academic Year 2024-25</h2>
      
      <div className="policy-intro">
        <p>The Student Development Policy at K. J. Somaiya College of Engineering reflects our commitment to fostering a dynamic and enriching academic environment for students across all levels of study, from Undergraduate (UG) to Postgraduate (PG) and Doctor of Philosophy (Ph.D.). This comprehensive policy, effective from the Academic Year 2024-25, serves as a guiding framework to encourage and support students in their pursuit of academic and professional development.</p>
      </div>

      <div className="policy-categories">
        {/* UG Categories */}
        <div className="category-section">
          <h3>Undergraduate (UG) Categories</h3>
          
          <div className="category-card">
            <h4>UG-I: In-house Student Projects within the Department</h4>
            <ul>
              <li><strong>Limit:</strong> Rs. 20,000/- per project</li>
              <li><strong>Scheme:</strong> Yearly</li>
              <li><strong>Apply:</strong> Anytime during the year</li>
              <li><strong>Submit to:</strong> Department SDC In-charge</li>
              <li><strong>Scrutiny Criteria:</strong>
                <ul>
                  <li>Department utility</li>
                  <li>College common facility utility</li>
                  <li>Upgradation possibility</li>
                </ul>
              </li>
            </ul>
          </div>

          <div className="category-card">
            <h4>UG-II: In-house Interdisciplinary Projects</h4>
            <ul>
              <li><strong>Limit:</strong> Rs. 30,000/- per project</li>
              <li><strong>Scheme:</strong> Yearly</li>
              <li><strong>Submit to:</strong> Department SDC In-charge</li>
              <li><strong>Scrutiny Criteria:</strong>
                <ul>
                  <li>Department(s) utility</li>
                  <li>College common facility utility</li>
                  <li>Upgradation possibility</li>
                </ul>
              </li>
            </ul>
          </div>

          <div className="category-card">
            <h4>UG-III: Participation in Competitions/Conferences</h4>
            <ul>
              <li><strong>Limits:</strong>
                <ul>
                  <li>State level: Rs. 5,000/- per group</li>
                  <li>National level: Rs. 10,000/- per group</li>
                  <li>International: Case basis</li>
                </ul>
              </li>
              <li><strong>Scheme:</strong> Once yearly per group</li>
              <li><strong>Apply:</strong> As per event date</li>
              <li><strong>Submit to:</strong> Department SDC In-charge</li>
              <li><strong>Scrutiny:</strong> SCI/SCOPUS index conferences</li>
            </ul>
            <div className="policy-note">
              <p>Note: Applications from current and previous academic year considered</p>
            </div>
          </div>
        </div>

        {/* PG Categories */}
        <div className="category-section">
          <h3>Postgraduate (PG) Categories</h3>
          
          <div className="category-card">
            <h4>PG-I: Professional Development Workshops/STTPs</h4>
            <ul>
              <li><strong>Limit:</strong> Rs. 2,000/- per student</li>
              <li><strong>Scheme:</strong> Once yearly</li>
              <li><strong>Apply:</strong> Within 8 days after completion</li>
              <li><strong>Submit to:</strong> Department SDC In-charge</li>
              <li><strong>Scrutiny:</strong> Case basis</li>
            </ul>
            <div className="policy-note">
              <p>Note: Applications from current and previous academic year considered</p>
            </div>
          </div>

          <div className="category-card">
            <h4>PG-II: Participation in Competitions/Conferences</h4>
            <ul>
              <li><strong>Limits:</strong>
                <ul>
                  <li>State level: Rs. 5,000/- per group</li>
                  <li>National level: Rs. 10,000/- per group</li>
                  <li>International: Case basis</li>
                </ul>
              </li>
              <li><strong>Scheme:</strong> Once yearly</li>
              <li><strong>Apply:</strong> As per event date</li>
              <li><strong>Submit to:</strong> Department SDC In-charge</li>
              <li><strong>Scrutiny:</strong> Case basis</li>
            </ul>
            <div className="policy-note">
              <p>Note: Only current academic year applications considered</p>
            </div>
          </div>
        </div>

        {/* Ph.D. Category */}
        <div className="category-section">
          <h3>Ph.D. Category</h3>
          
          <div className="category-card">
            <h4>RI: Publications/Presentations/Workshops</h4>
            <ul>
              <li><strong>Publication Limit:</strong> Rs. 25,000/-</li>
              <li><strong>Project Seed Money:</strong> Rs. 50,000/- (entire Ph.D tenure)</li>
              <li><strong>Scheme:</strong> Once yearly during research</li>
              <li><strong>Apply:</strong> Within 8 days after resuming college</li>
              <li><strong>Submit to:</strong> Departmental SDC In-charge</li>
              <li><strong>Scrutiny Criteria:</strong>
                <ul>
                  <li>After University registration</li>
                  <li>Mainly covers registration fees</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="expected-outcomes">
        <h3>Expected Outcomes</h3>
        <ul>
          <li>Each B.Tech/M.Tech project to publish at least one research paper</li>
          <li>Student participation in national/international competitions</li>
          <li>All FY to TY students to develop at least one group project/startup</li>
        </ul>
      </div>

      <div className="signature">
        <p>Dr. Suresh Wkarande</p>
        <p>Principal</p>
      </div>

      <button onClick={handleDownload} className="download-btn">
        Download Full Policy PDF
      </button>
    </div>
  );
};

export default Policy;