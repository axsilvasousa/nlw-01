import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import "./styles.css";

interface Props {
  onUploaded: (file: File) => void;
}
const Dropzone: React.FC<Props> = ({ onUploaded }) => {
  const [selectFileUrl, setSelectFileUrl] = useState("");
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const fileUrl = URL.createObjectURL(file);
      setSelectFileUrl(fileUrl);
      onUploaded(file);
    },
    [onUploaded]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />
      {selectFileUrl ? (
        <img src={selectFileUrl} alt="Point" />
      ) : (
        <p>
          <FiUpload />
          Imagem do estabelecimento
        </p>
      )}
    </div>
  );
};
export default Dropzone;
