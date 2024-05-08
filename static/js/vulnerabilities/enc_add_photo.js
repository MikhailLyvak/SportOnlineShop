function formatFileSize(sizeInBytes) {
    const KB = sizeInBytes / 1024;
    const MB = KB / 1024;
  
    if (MB >= 1) {
      return `${MB.toFixed(2)} MB`;
    } else {
      return `${KB.toFixed(2)} KB`;
    }
  }

document.addEventListener("DOMContentLoaded", function () {
    const fileInput2 = document.getElementById("fileInput2");
    const dropzonePreview2 = document.getElementById("dropzone-preview2");

    function removeListItem2(listItem) {
        dropzonePreview2.removeChild(listItem);
    }

    fileInput2.addEventListener("change", function () {
        dropzonePreview2.innerHTML = "";

        const selectedFiles = fileInput2.files;

        for (let i = 0; i < selectedFiles.length; i++) {
            const listItem = document.createElement("li");
            listItem.classList.add(
                "mt-2",
                "dz-processing",
                "dz-image-preview",
                "dz-success",
                "dz-complete"
            );

            const imageContainer = document.createElement("div");
            imageContainer.classList.add("border", "rounded");

            const flexContainer = document.createElement("div");
            flexContainer.classList.add("d-flex", "p-2");

            const imageDiv = document.createElement("div");
            imageDiv.classList.add("flex-shrink-0", "me-3");
            const imageThumbnail = document.createElement("div");
            imageThumbnail.classList.add("avatar-sm", "bg-light", "rounded");
            const imageElement = document.createElement("img");
            imageElement.setAttribute("data-dz-thumbnail", "");
            imageElement.classList.add("img-fluid", "rounded", "d-block");
            imageElement.src = URL.createObjectURL(selectedFiles[i]);
            imageThumbnail.appendChild(imageElement);
            imageDiv.appendChild(imageThumbnail);

            const textContainer = document.createElement("div");
            textContainer.classList.add("flex-grow-1", "pt-1");

            const fileNameHeader = document.createElement("h5");
            fileNameHeader.classList.add("fs-14", "mb-1");
            fileNameHeader.setAttribute("data-dz-name", "");
            fileNameHeader.textContent = selectedFiles[i].name;

            const fileSize = document.createElement("p");
            fileSize.classList.add("fs-13", "text-muted", "mb-0");
            fileSize.setAttribute("data-dz-size", "");
            fileSize.innerHTML = `<strong>${formatFileSize(selectedFiles[i].size)}</strong>`;

            const errorMessage = document.createElement("strong");
            errorMessage.classList.add("error", "text-danger");
            errorMessage.setAttribute("data-dz-errormessage", "");

            textContainer.appendChild(fileNameHeader);
            textContainer.appendChild(fileSize);
            textContainer.appendChild(errorMessage);

            const deleteButtonDiv = document.createElement("div");
            deleteButtonDiv.classList.add("flex-shrink-0", "ms-3");
            const deleteButton = document.createElement("button");
            deleteButton.setAttribute("data-dz-remove", "");
            deleteButton.classList.add("btn", "btn-sm", "btn-danger");
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function (event) {
                event.preventDefault();
                removeListItem2(listItem);
            });

            deleteButtonDiv.appendChild(deleteButton);

            flexContainer.appendChild(imageDiv);
            flexContainer.appendChild(textContainer);
            flexContainer.appendChild(deleteButtonDiv);

            imageContainer.appendChild(flexContainer);
            listItem.appendChild(imageContainer);

            dropzonePreview2.appendChild(listItem);
        }
    });
});