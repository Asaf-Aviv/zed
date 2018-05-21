function uploadImage() {
    uploadcare.openDialog(null, {
        crop: "disabled",
        imagesOnly: true
        }).done(function(file) {
            file.promise().done(fileInfo => {
                console.log(fileInfo)
                $.post('/upload/images', {
                    uuid: fileInfo.uuid,
                    cdnUrl: fileInfo.cdnUrl
                }, () => {})
                    .done(data => successAlert('Upload complete', 'topRight', 'fa fa-check'))
                    .fail(data => errorAlert('Something went wrong :/ Please try again.', 'center'))
            });
    });
}