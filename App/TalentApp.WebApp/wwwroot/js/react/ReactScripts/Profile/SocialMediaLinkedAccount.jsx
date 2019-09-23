/* Social media JSX */
import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import Joi from 'joi-browser';
import { Button, Icon } from 'semantic-ui-react';

export default class SocialMediaLinkedAccount extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showEditSection: false,
            data: {
                linkedAccounts: {
                    linkedIn: '',
                    github: '',
                }
            },
        };

        this.schema = {
            linkedIn: Joi.string().allow('').regex(/linkedin.com/, 'LinkedIn Address').label('LinkedIn'),
            github: Joi.string().allow('').regex(/github.com/, 'LinkedIn Address').label('GitHub'),
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveData = this.saveData.bind(this)
        this.validate = this.validate.bind(this)
    }

    validate() {
        const result = Joi.validate(this.state.data.linkedAccounts, this.schema);
        return result;
    }

    openEdit() {
        const { linkedIn, github } = this.props.linkedAccounts;
        const data = { linkedAccounts: { linkedIn, github } }
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
        data.linkedAccounts[event.target.name] = event.target.value
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
        const { linkedIn, github } = this.state.data.linkedAccounts

        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    label="LinkedIn"
                    name="linkedIn"
                    value={linkedIn}
                    controlFunc={this.handleChange}
                    placeholder="Please paste your LinkedIn url here."
                    errorMessage="Please enter a valid LinkedIn url"
                />
                <ChildSingleInput
                    inputType="text"
                    label="GitHub"
                    name="github"
                    value={github}
                    controlFunc={this.handleChange}
                    placeholder="Please paste your GitHub url here."
                    errorMessage="Please enter a valid GitHub url"
                />
                <button type="button" className="ui teal button" onClick={this.saveData}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
        )
    }

    renderDisplay() {
        let linkedIn = this.props.linkedAccounts.linkedIn ? this.props.linkedAccounts.linkedIn : "";
        let github = this.props.linkedAccounts.github ? this.props.linkedAccounts.github : "";

        return (
            <div className="ui sixteen wide column">
                <React.Fragment>
                    <Button color='linkedin' href={linkedIn}>
                        <Icon name='linkedin' /> LinkedIn
                    </Button>
                    <Button color='black' href={github}>
                        <Icon name='github' /> GitHub
                    </Button>
                </React.Fragment>
                <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
            </div>
        )
    }
}