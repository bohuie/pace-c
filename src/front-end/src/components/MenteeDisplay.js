import React, { Component } from 'react';
import { Button } from 'antd';
import { UserOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

// eslint-disable-next-line react/prefer-stateless-function
class MenteeDisplay extends Component {
  render() {
    return (
      <div className="mentee-requests">
        <div className="individual-mentee">
          <table>
            <tr>
              <th>
                <UserOutlined className="user-icon" />
                {this.props.name}
              </th>
            </tr>
            <tr>
              <td>
                <strong> Email: </strong>
                {this.props.email}
              </td>
            </tr>
            <tr>
              <td>
                <strong> Skills Seeking Mentorship: </strong>
                {this.props.skills}
              </td>
            </tr>
            <tr>
              <td>
                <strong> Description: </strong> {this.props.description}
              </td>
            </tr>
            <tr>
              <td>
                {this.props.request}
                <Button
                  type="text"
                  onClick={this.handleButtonClick}
                  id="accept"
                >
                  Accept
                  <CheckOutlined className="check" />{' '}
                </Button>
                <Button
                  type="text"
                  onClick={this.handleButtonClick}
                  id="decline"
                >
                  Decline
                  <CloseOutlined className="close" />{' '}
                </Button>
              </td>
            </tr>
          </table>
        </div>
      </div>
    );
  }
}
MenteeDisplay.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  skills: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  request: PropTypes.bool.isRequired,
};

export default MenteeDisplay;
