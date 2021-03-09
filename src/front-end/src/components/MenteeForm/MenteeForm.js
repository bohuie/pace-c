import React, { Component } from 'react';
import { Form, Button, Input, Select, notification } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import emailjs from 'emailjs-com';
import MenteeCompletion from '../MenteeCompletion/MenteeCompletion';
import {
  marshallMenteeInfo,
  pushToDB,
  getCamelCase,
} from '../../helper-methods';
import firebase from '../../firebase-init';
import timeZones from '../../timeZones.json';

const { Option } = Select;
const learnableSkills = [
  'Time management',
  'Leadership',
  'Interpersonal Communication',
  'Problem solving',
];

class MenteeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitted: false,
      email: '',
      name: '',
      selectedItems: [],
    };
    this.onFinish = this.onFinish.bind(this);
    this.onFinishFailed = this.onFinishFailed.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSkillsChange = this.handleSkillsChange.bind(this);
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  handleSkillsChange(event) {
    this.setState({ selectedItems: event });
  }

  sendEmail() {
    const email = this.state.email;
    const name = this.state.name;
    const templateParams = {
      nameInput: name,
      emailInput: email,
    };

    emailjs.send(
      'gmail',
      'template_kfjkdm4',
      templateParams,
      'user_2x3ekfRvEqEttZg87VyrZ',
    );
    return false;
  }

  onFinish(values) {
    firebase
      .database()
      .ref()
      .child('users')
      .orderByChild('email')
      .equalTo(values.emailInput)
      .once('value')
      .then((snapshot) => {
        // if exists, alert.
        if (snapshot.exists()) {
          notification.open({
            message: 'Warning',
            description:
              'The email address that you entered is already associated with an email address in our system.',
            icon: <WarningOutlined style={{ color: 'orangered' }} />,
          });
          this.setState({ isSubmitted: false });
          // if not exists, create new account and jump to completion page.
        } else {
          this.sendEmail(values);
          pushToDB('users', marshallMenteeInfo(values));
          this.setState({ isSubmitted: true });
          window.alert(
            'your form has been submitted successfully! A new tab will be open in 3 seconds.',
          );
          setTimeout(() => window.open('http://localhost:3000/'), 3000);
        }
      });
  }

  onFinishFailed(values) {
    console.log('Failed submit:', values);
  }

  render() {
    const { selectedItems } = this.state;

    if (this.state.isSubmitted) {
      return <MenteeCompletion />;
    }
    if (!this.state.isSubmitted) {
      return (
        <div className="MenteeForm">
          <Form
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            autoComplete="off"
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 16 }}
            layout="horizontal"
            labelAlign="left"
          >
            <h1>Sign up as a Mentee</h1>

            <Form.Item
              label="Name"
              id="nameInput"
              name="nameInput"
              // must have an input:
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input
                onInput={this.handleNameChange}
                id="nameid"
                placeholder="First name Last name"
              />
            </Form.Item>
            <Form.Item
              label="Email"
              id="emailInput"
              type="email"
              name="emailInput"
              // must have an input:
              rules={[
                {
                  required: true,
                  message: 'Please enter your email in a proper format',
                },
              ]}
            >
              <Input
                onInput={this.handleEmailChange}
                id="emailid"
                placeholder="name@example.com"
                type="email"
              />
            </Form.Item>
            <Form.Item
              label="Time-zone"
              name="timeZone"
              // must have an input:
              rules={[{ required: true, message: 'This field is required' }]}
            >
              <Select placeholder="Select timezone.." showSearch>
                {timeZones.map((zone) => {
                  return (
                    <Option key={zone.id} value={getCamelCase(zone.id)}>
                      {[zone.id, ' ', zone.area]}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              name="skillset"
              label="Top 3 skills"
              tooltip="What skills are you looking to learn?"
              rules={[
                {
                  required: true,
                  message:
                    'Please tell us the skills you are seeking mentorship in',
                },
              ]}
            >
              <Select
                mode="multiple"
                value={selectedItems}
                onChange={this.handleSkillsChange}
              >
                {learnableSkills.map((item) => (
                  <Option
                    key={item}
                    value={getCamelCase(item)}
                    disabled={
                      selectedItems.length >= 3 &&
                      !selectedItems.includes(getCamelCase(item))
                    }
                  >
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  required: true,
                  message: 'Please introduce yourself to us.',
                },
              ]}
            >
              <Input.TextArea placeholder="Tell us a bit about yourself. Please be advised that this description will be shared with Mentors that you match with." />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="formSubmitButton"
              size="large"
            >
              Submit
            </Button>
          </Form>
        </div>
      );
    }
    return null;
  }
}
// exports:
export default MenteeForm;
