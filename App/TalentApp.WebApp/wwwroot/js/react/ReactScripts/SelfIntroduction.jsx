/// <reference path="socialmedialinkedaccount.jsx" />
/* Self introduction section */
import React, { Component } from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import Joi from 'joi-browser';

export default class SelfIntroduction extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showEditSection: false,
            data: {
                summary: '',
                description: '',
            },
        };

        this.schema = {
            summary: Joi.string().label('Summary'),
            description: Joi.string().min(150).label('Description'),
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveData = this.saveData.bind(this)
        this.validate = this.validate.bind(this)
    };

    validate() {
        const result = Joi.validate(this.state.data, this.schema);
        return result;
    }

    openEdit() {
        const data = {
            summary: this.props.summary,
            description: this.props.description,
        }
        this.setState({
            showEditSection: true,
            data,
        })
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    handleChange(event) {
        const { data } = this.state
        data[event.target.name] = event.target.value
        this.setState({ data })
    }

    saveData() {
        const result = this.validate()
        if (result.error) {
            const errorMessage = result.error.details[0].message;
            TalentUtil.notification.show(errorMessage, "error", null, null)
        }
        else {
            const { data } = this.state
            this.props.saveProfileData(data)
            this.closeEdit()
        }
    }


    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderEdit() {
        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    //label="Summary"
                    name="summary"
                    value={this.state.data.summary}
                    controlFunc={this.handleChange}
                    maxLength={this.props.summaryCharectorLimit}
                    placeholder="Please provide a short summary about yourself."
                    errorMessage="Please enter a valid summary"
                />
                <p> Summary must be no more than 150 characters. </p>
                <textarea
                    name="description"
                    value={this.state.data.description}
                    onChange={this.handleChange}
                    maxLength={this.props.descriptionCharectorLimit}
                    placeholder="Please tell us about any hobbies, addtional experties, or anything else you'd like to add."
                />
                <p> Description must be between 150-600 characters. </p>

                <button type="button" className="ui teal button" onClick={this.saveData}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
        )
    }

    renderDisplay() {
        let summary = this.props.summary ? this.props.summary : ""
        let description = this.props.description ? this.props.description : ""

        return (
            <div className="ui sixteen wide column">
                <React.Fragment>
                    <h5>Summary:</h5>
                    <p>{summary}</p>
                    <h5>Description:</h5>
                    <p>{description}</p>
                </React.Fragment>
                <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
            </div>
        )
    }
}



