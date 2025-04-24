export function formatDate(date : Date) : string {
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

// export function getImageString(imageFile : File) : string {
//     const file = imageFile;
//     console.log(file.name);
//     const reader = new FileReader();
//     var base64Image = "";

//     reader.onload = () => {
//         if (reader.result) {
//             base64Image = reader.result.toString();
//         }
//     };
//     console.log(base64Image);
//     return base64Image;
// }

export function getImageString(imageFile: File): Promise<string> {
    console.log(imageFile.name);
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.result) {
                resolve(reader.result.toString());
            } else {
                reject("FileReader result is null.");
            }
        };

        reader.onerror = (error) => reject(error);

        reader.readAsDataURL(imageFile); // This gives you a base64-encoded string
    });
}

export async function uploadImage(_image: string) : Promise<string> {
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

    const res = JSON.parse(await response.text());

    return "https://ohtheplacesyoullgo.space/images/" + res.filename;
}