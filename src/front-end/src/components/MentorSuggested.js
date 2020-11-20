import React, { Component } from 'react';
import { Form } from 'antd';
import 'react-bootstrap-timezone-picker/dist/react-bootstrap-timezone-picker.min.css';
import MenteeDisplay from './MenteeDisplay';
import fire from '../firebase-init';
import { fetchMenteesIDs, fetchMenteesFullInfo } from '../helper-methods';

// eslint-disable-next-line react/prefer-stateless-function
class MentorSuggested extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mentees: [],
      loggedUid: null,
    };

    this.acceptMentee = this.acceptMentee.bind(this);
    this.declineMentee = this.declineMentee.bind(this);
    this.loadSuggestedMentees = this.loadSuggestedMentees.bind(this);
  }

  loadSuggestedMentees() {
    const userRef = fire.database().ref('users/' + this.state.loggedUid);
    const myMentees = ['-MLy_owDfdsfsZSNtIanUi6', '-MLy_owDS4aZSNtIanUi6'];
    userRef.child('suggestedMentees').set(myMentees);
    // eslint-disable-next-line
    location.reload();
  }

  acceptMentee(menteeUid) {
    const userRef = fire.database().ref('users/' + this.state.loggedUid);
    userRef.once('value', (snapshot) => {
      // Build updated declined and suggested mentees arrays
      const acceptedMentees = snapshot.val().acceptedMentees
        ? snapshot.val().acceptedMentees
        : [];
      acceptedMentees.push(menteeUid);
      const suggestedMentees = snapshot.val().suggestedMentees;
      suggestedMentees.splice(suggestedMentees.indexOf(menteeUid), 1);

      // Update the accepted and suggested mentees in DB
      userRef.child('acceptedMentees').set(acceptedMentees);
      userRef.child('suggestedMentees').set(suggestedMentees);

      // Update the state to reflect the DB changes
      const currentMentees = this.state.mentees;
      const newMentees = currentMentees.filter((mentee) => {
        return mentee.id !== menteeUid;
      });
      this.setState({
        mentees: newMentees,
      });

      // Confirm with the user that this was succesful
      alert('Mentee request accepted!');
    });
  }

  declineMentee(menteeUid) {
    const userRef = fire.database().ref('users/' + this.state.loggedUid);
    userRef.once('value', (snapshot) => {
      // Build updated declined and suggested mentees arrays
      const declinedMentees = snapshot.val().declinedMentees
        ? snapshot.val().declinedMentees
        : [];
      declinedMentees.push(menteeUid);
      const suggestedMentees = snapshot.val().suggestedMentees;
      suggestedMentees.splice(suggestedMentees.indexOf(menteeUid), 1);

      // Update the accepted and suggested mentees in DB
      userRef.child('declinedMentees').set(declinedMentees);
      userRef.child('suggestedMentees').set(suggestedMentees);

      // Update the state to reflect the DB changes
      const currentMentees = this.state.mentees;
      const newMentees = currentMentees.filter((mentee) => {
        return mentee.id !== menteeUid;
      });
      this.setState({
        mentees: newMentees,
      });

      // Confirm with the user that this was succesful
      alert('Mentee request declined.');
    });
  }

  authListener() {
    return new Promise((resolve) => {
      fire.auth().onAuthStateChanged((user) => {
        this.setState({ loggedUid: user.uid });
        resolve(user.uid);
      });
    });
  }

  componentDidMount() {
    this.authListener().then((uid) => {
      fetchMenteesIDs(uid, 'suggested').then((menteesIDs) => {
        fetchMenteesFullInfo(menteesIDs, this);
      });
    });
  }

  render() {
    return (
      <>
        <button type="button" onClick={this.loadSuggestedMentees}>
          load
        </button>
        <Form>
          <h1>
            <center>These are your suggested mentees:</center>
          </h1>
        </Form>
        <br />
        {this.state.mentees.map((mentee) => {
          return (
            <MenteeDisplay
              name={mentee.name}
              email={mentee.email}
              skills={mentee.rankedSkills.join(', ')}
              description={mentee.description}
              request
              acceptMentee={this.acceptMentee}
              declineMentee={this.declineMentee}
              menteeUid={mentee.id}
            />
          );
        })}
      </>
    );
  }
}
// exports:
export default MentorSuggested;
