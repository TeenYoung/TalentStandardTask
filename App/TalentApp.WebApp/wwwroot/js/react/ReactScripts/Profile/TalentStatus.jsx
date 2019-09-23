import React from 'react'
import { Form, Checkbox } from 'semantic-ui-react';
import { SingleInput } from '../Form/SingleInput.jsx';

export default class TalentStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                jobSeekingStatus: {
                    status: "",
                },
            }
        }

        this.handleChange = this.handleChange.bind(this)
        this.saveData = this.saveData.bind(this)
    }

    handleChange(e, { value }) {
        const data = {
            jobSeekingStatus:
            {
                status: value,
            }
        }
        this.setState({ data }, this.saveData)
    }

    saveData() {
        const { data } = this.state
        this.props.saveProfileData(data)
    }

    render() {
        const status = this.props.status ? this.props.status.status : "";
        return (
            <div className="ui sixteen wide column">
                <h5>Current Status</h5>
                <Form.Radio
                    label='Actively looking for a job'
                    value='active'
                    checked={status === 'active'}
                    onChange={this.handleChange}
                />
                <Form.Radio
                    label='Not looking for a job at the moment'
                    value='notNow'
                    checked={status === 'notNow'}
                    onChange={this.handleChange}
                />
                <Form.Radio
                    label='Currently employed but open to offer'
                    value='employed'
                    checked={status === 'employed'}
                    onChange={this.handleChange}
                />
                <Form.Radio
                    label='Will be available on later date'
                    value='later'
                    checked={status === 'later'}
                    onChange={this.handleChange}
                />
            </div>
        )

    }
}