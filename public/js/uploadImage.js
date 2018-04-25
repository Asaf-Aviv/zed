UPLOADCARE_LOCALE = "en";
UPLOADCARE_TABS = "file url facebook gdrive gphotos dropbox instagram evernote flickr skydrive";
UPLOADCARE_PUBLIC_KEY = "3d33781c577953db2ccb";

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