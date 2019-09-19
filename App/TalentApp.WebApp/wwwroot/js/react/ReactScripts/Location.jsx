import React from 'react'
import Cookies from 'js-cookie'
import { default as Countries } from '../../../../util/jsonFiles/countries.json';
import Joi from 'joi-browser';
import { Dropdown, Form } from 'semantic-ui-react'


export class Address extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            showEditSection: false,
            countryOptions: [],
            cityOptions: [],

            data: {
                address: {
                    number: '',
                    street: '',
                    suburb: '',
                    country: '',
                    city: '',
                    postCode: 0,
                }
            },
        };

        this.schema = {
            number: Joi.string().label('Number'),
            street: Joi.string().label('Street'),
            suburb: Joi.string().label('Suburb'),
            country: Joi.string().label('Country'),
            city: Joi.string().label('City'),
            postCode: Joi.number().label('Post Code'),
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveData = this.saveData.bind(this)
        this.initOptions = this.initOptions.bind(this);
        this.updateCityOptions = this.updateCityOptions.bind(this)
        this.validate = this.validate.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
    }

    initOptions() {
        var countries = Object.keys(Countries);
        var countryOptions = countries.map((country, index) => {
            return { key: index, value: country, text: country }
        });
        this.setState({ countryOptions });

        this.updateCityOptions()
    }

    updateCityOptions() {
        const { country } = this.state.data.address

        var cities = country ? Countries[country] : [];
        var cityOptions = cities.map((city, index) => {
            return { key: index, value: city, text: city }
        });
        this.setState({ cityOptions });
    }

    openEdit() {
        const { number, street, suburb, country, city, postCode, } = this.props.addressData;
        const data = {
            address: { number, street, suburb, country, city, postCode, }
        }
        this.setState({
            showEditSection: true,
            data,
        }, this.initOptions)
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    handleChange(e, d) {
        const { data } = this.state
        data.address[d.name] = d.value
        if (d.name === "country") {
            this.setState({ data }, this.updateCityOptions)
        }
        else this.setState({ data })
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

    validate() {
        const result = Joi.validate(this.state.data.address, this.schema);
        return result;
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderEdit() {
        const { number, street, suburb, country, city, postCode, } = this.state.data.address;

        return (
            <div className='ui sixteen wide column'>
                <Form.Group>
                    <Form.Input label='Number'
                        placeholder='Number'
                        name="number"
                        value={number}
                        onChange={this.handleChange}
                        width={4}
                    />
                    <Form.Input label='Street'
                        placeholder='Street'
                        name="street"
                        value={street}
                        onChange={this.handleChange}
                        width={8}
                    />
                    <Form.Input label='Suburb'
                        placeholder='Suburb'
                        name="suburb"
                        value={suburb}
                        onChange={this.handleChange}
                        width={4}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Dropdown label='Country'
                        placeholder='Country'
                        name="country"
                        value={country}
                        search
                        selection
                        options={this.state.countryOptions}
                        onChange={this.handleChange}
                        width={6}
                    />
                    <Form.Dropdown label='City'
                        placeholder='City'
                        name="city"
                        value={city}
                        search
                        selection
                        disabled={country ? false : true}
                        options={this.state.cityOptions}
                        onChange={this.handleChange}
                        width={6}
                    />
                    <Form.Input label='Post Code'
                        placeholder='Post Code'
                        name="postCode"
                        value={postCode}
                        onChange={this.handleChange}
                        width={4}
                    />
                </Form.Group>

                <button type="button" className="ui teal button" onClick={this.saveData}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
        )
    }

    renderDisplay() {
        let { number, street, suburb, country, city, postCode, } = this.props.addressData;

        return (
            <div className="ui sixteen wide column">
                <React.Fragment>
                    <p>Address: {number} {street}, {suburb} {postCode}</p>
                    <p>City: {city}</p>
                    <p>Country: {country}</p>
                </React.Fragment>
                <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
            </div>
        )
    }
}

export class Nationality extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            countryOptions: [],
            data: {
                nationality: "",
            }
        }

        this.handleChange = this.handleChange.bind(this);
        this.saveData = this.saveData.bind(this)
        this.initOptions = this.initOptions.bind(this)
    }

    componentDidMount() {
        this.initOptions()
    }

    initOptions() {
        var countries = Object.keys(Countries);
        var countryOptions = countries.map((country, index) => {
            return { key: index, value: country, text: country }
        });
        this.setState({ countryOptions });
    }

    handleChange(e, d) {
        const { data } = this.state
        data[d.name] = d.value
        this.setState({ data }, this.saveData)
    }

    saveData() {
        const { data } = this.state
        this.props.saveProfileData(data)
    }

    render() {
        return (
            <div className="ui sixteen wide column">
                < Dropdown
                    name='nationality'
                    placeholder='Select Natinality'
                    search
                    selection
                    options={this.state.countryOptions}
                    value={this.props.nationalityData}
                    onChange={this.handleChange}
                />
            </div>
        )
    }
}