export function formatDate(date : Date) : string {
    const formattedDate = `${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date
        .getFullYear()
        .toString()}`;
        
    return formattedDate;
}

export function getImageString(imageFile : File) : string {
    const file = imageFile;
    const reader = new FileReader();
    var base64Image = "";

    reader.onload = () => {
        if (reader.result) {
            base64Image = reader.result.toString();
        }
    };
    return base64Image;
}