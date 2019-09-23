/* Photo upload section */
import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { Button, Form, Grid, Icon, Input, Image, Label, Dropdown } from 'semantic-ui-react';

export default class PhotoUpload extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedFile: null,
            selectedFileUrl: "",
        }

        this.fileChange = this.fileChange.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.renderPlaceholder = this.renderPlaceholder.bind(this);
        this.renderThumbnail = this.renderThumbnail.bind(this);
    };

    fileChange(event) {
        if (event.target.files && event.target.files[0]) {
            this.setState({
                selectedFile: event.target.files[0],
                selectedFileUrl: URL.createObjectURL(event.target.files[0])
            })
        }
    }

    uploadFile() {
        const { savePhotoUrl } = this.props;
        var cookies = Cookies.get('talentAuthToken');
        const formData = new FormData();
        const file = this.state.selectedFile;
        formData.append('files', file)

        this.setState({ selectedFile: null })

        $.ajax({
            url: savePhotoUrl,
            headers: {
                'Authorization': 'Bearer ' + cookies,
            },
            processData: false,
            contentType: false,
            type: "POST",
            data: formData,
            success: function (res) {
                console.log(res)
                if (res.success == true) {
                    TalentUtil.notification.show("Profile updated sucessfully", "success", null, null)
                } else {
                    TalentUtil.notification.show("Profile did not update successfully", "error", null, null)
                }
            }.bind(this),
            error: function (res, a, b) {
                console.log(res)
                console.log(a)
                console.log(b)
            }
        })
    }


    renderPlaceholder() {
        return (
            <div style={{ 'margin': '15px auto' }}>
                <div className='button'>
                    <label htmlFor='photo'>
                        <Icon name="camera retro" circular size="massive" link />
                    </label>
                </div>
                <input
                    type="file"
                    id="photo"
                    hidden
                    onChange={this.fileChange}
                />
            </div>
        )
    }

    renderThumbnail() {
        const { imageUrl } = this.props;
        const { selectedFile, selectedFileUrl } = this.state;
        return (
            <div style={{ 'margin': '15PX auto' }}>
                <label htmlFor='photo'>
                    <Image src={selectedFileUrl ? selectedFileUrl : imageUrl} size="medium" circular />
                </ label>
                <input
                    type="file"
                    id="photo"
                    hidden
                    onChange={this.fileChange}
                />

                {
                    selectedFile ?
                        <Button type="button"
                            fluid
                            color="teal"
                            content="Upload"
                            onClick={this.uploadFile}
                            style={{ 'margin': '15PX auto' }}
                        />
                        :
                        null
                }
            </div>
        )
    }

    render() {
        const { imageUrl } = this.props
        const { selectedFileUrl } = this.state;

        if (!selectedFileUrl && !imageUrl) {
            return (
                this.renderPlaceholder()
            )
        }
        return (
            this.renderThumbnail()
        )
    }
}
