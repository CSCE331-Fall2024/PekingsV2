import React, { useState } from 'react';
import '../App.css';
import './Application.css';

const Application = () => {

    //variables controlling input areas
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [gender, setGender] = useState('');
    const [race, setRace] = useState('');
    const [reason, setReason] = useState('');
    const [isHired, setIsHired] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [rejectFeedback, setRejectFeedback] = useState('');
    const [showHireDialog, setShowHireDialog] = useState(false);

    const handleSubmit = () => {
        // Close any open dialogs first
        setShowHireDialog(false);
        setShowRejectDialog(false);

        const hired = Math.random() < 0.2;
        setIsHired(hired);

        if (hired) {
            setShowHireDialog(true);
        }
        else {
            setShowRejectDialog(true);
        }
    };

    const handleEmployeeAdd = async () => {
        try {
            // email uses username
            const email = `${username}@gmail.com`;

            // employee obj
            const employee = {
                // id is auto-incrementing, so we don't include
                username: username,
                pass: password,
                email: email,
                position: position, // from the position select dropdown
                last_clockin: new Date().toISOString(), // current time
                is_clockedin: false, // default set as not clocked in
                pin: '1234' // Default PIN we use
            };

            const response = await fetch('/api/employee/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employee)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'No error details available' }));
                throw new Error(`Server responded with ${response.status}: ${errorData.message}`);
            }

            const responseData = await response.json();
            console.log('Employee added:', responseData); //for debugging and to see responses

            // Clear form and close dialog
            handleCloseDialog();

            // Show success message
            alert('Employee added successfully! Your PIN is: 1234');
        }
        catch (error) {
            console.error('Error adding employee:', error);
            alert(`Failed to add employee: ${error.message}`);
        }
    };

    const handleCloseDialog = () => {
        setShowHireDialog(false);
        setShowRejectDialog(false);
        setName('');
        setPosition('');
        setGender('');
        setRace('');
        setReason('');
        setUsername('');
        setPassword('');
        setRejectFeedback('');
    };

    return (
        // background and page
        <div className="application-container">
            <div className="application-background">

                {/* Actual resume form area */}
                <div className="form-container">
                    <h2 className="form-title">PeKings Career Application</h2>
                    <p className="form-description">Fill out the form below to apply for a position.</p>

                    <div className="form-grid">

                        {/* Name input area */}
                        <div>
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                id="name"
                                type="text"
                                className="input-field"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        {/* Position select / TO:DO: take into account when submitting to database */}
                        <div>
                            <label htmlFor="position" className="form-label">Position</label>
                            <select
                                id="position"
                                className="input-field-p"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                            >
                                <option value="">Select a position</option>
                                <option value="Employee">Employee</option>
                                <option value="Manager">Manager</option>
                            </select>
                        </div>

                        {/* Gender select */}
                        <div>
                            <label htmlFor="gender" className="form-label">Gender</label>
                            <input
                                id="gender"
                                type="text"
                                className="input-field"
                                placeholder="Enter your gender"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            />
                        </div>

                        {/* Race select */}
                        <div>
                            <label htmlFor="race" className="form-label">Race</label>
                            <input
                                id="race"
                                type="text"
                                className="input-field"
                                placeholder="Enter your race"
                                value={race}
                                onChange={(e) => setRace(e.target.value)}
                            />
                        </div>

                        {/* Resume input */}
                        <div>
                            <label htmlFor="resume" className="form-label">Resume</label>
                            <input
                                id="resume"
                                type="file"
                                className="input-field-f"
                                onChange={(e) => setResume(e.target.files[0])}
                            />
                        </div>

                        {/* Reason select */}
                        <div>
                            <label htmlFor="reason" className="form-label">Reason for Working</label>
                            <textarea
                                id="reason"
                                className="input-field"
                                placeholder="Enter your reason for working here"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            ></textarea>
                        </div>

                    </div>

                    <button className="submit-btn" onClick={handleSubmit}>Submit Application</button>
                </div>

                {/* Hire Dialog */}
                {showHireDialog && (
                    <div className="dialog-box dialog-hire">
                        <h2 className="dialog-title">You're Hired!</h2>
                        <p className="dialog-message">Congratulations! You have been hired.</p>


                        <div className="form-grid">

                            {/* Username submission */}
                            <div>
                                <label htmlFor="username" className="form-label">Username</label>
                                <input
                                    id="username"
                                    type="text"
                                    className="input-field"
                                    placeholder="Enter a username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            {/* Password submission */}
                            <div>
                                <label htmlFor="password" className="form-label">Password</label>
                                <div style={{ display: 'flex' }}>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        className="input-field"
                                        placeholder="Enter a password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button type="button" className="toggle-pass" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>

                        </div>

                        {/* Changed to use handleEmployeeAdd instead of handleCloseDialog */}
                        <button className="close-btn" onClick={handleEmployeeAdd}>Submit and Close</button>

                    </div>
                )}

                {/* Reject Dialog */}
                {showRejectDialog && (
                    <div className="dialog-box dialog-reject">
                        <h2 className="dialog-title">Sorry, you're rejected. Go flip burgers instead.</h2>
                        <div>
                            <label htmlFor="reject-feedback" className="form-label">Feedback</label>
                            <textarea
                                id="reject-feedback"
                                className="input-field"
                                placeholder="Enter your feedback"
                                value={rejectFeedback}
                                onChange={(e) => setRejectFeedback(e.target.value)}
                            ></textarea>
                        </div>
                        <button className="close-btn" onClick={handleCloseDialog}>Close</button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Application;