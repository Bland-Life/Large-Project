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

export async function uploadImage(_image: string) {
    var image = {
        image: _image
    };
    const response = await fetch('https://ohtheplacesyoullgo.space/api/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(image),
    });
}