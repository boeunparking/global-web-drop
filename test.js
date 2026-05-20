import React, { useState } from "react";

export default function UploadComponent() {
  const [downloadLink, setDownloadLink] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 1. 파일 데이터를 담을 바구니(FormData) 생성
    const formData = new FormData();
    formData.append("shared_file", file); // PHP에서 'shared_file'이라는 이름으로 받게 됨

    setIsUploading(true);

    try {
      // 2. AWS EC2에 구동 중인 PHP 서버 API로 요청 전송
      const response = await fetch("https://api.yourdomain.com/upload.php", {
        method: "POST",
        body: formData, // JSON.stringify를 하지 않고 FormData 객체를 그대로 보냅니다.
      });

      // 3. PHP 서버가 돌려준 JSON 응답 해석 (텍스트를 자바스크립트 객체로 변환)
      const data = await response.json();

      if (data.status === "success") {
        // 4. 성공 시 PHP가 보내준 다운로드 링크를 상태에 저장 -> UI 자동 리렌더링
        setDownloadLink(data.download_url);
      } else {
        alert("Upload failed: " + data.message);
      }
    } catch (error) {
      console.error("통신 에러:", error);
      alert("Server error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-sm mx-auto text-center">
      <h3 className="text-lg font-bold mb-4">File Upload</h3>

      {isUploading ? (
        <p className="text-blue-600 animate-pulse">Uploading to server...</p>
      ) : (
        <input
          type="file"
          onChange={handleFileUpload}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
        />
      )}

      {/* 다운로드 링크 데이터가 들어오면 렌더링되는 결과 UI */}
      {downloadLink && (
        <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs text-green-800 font-medium">Link Generated!</p>
          <a
            href={downloadLink}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-600 underline block mt-1 font-mono break-all"
          >
            {downloadLink}
          </a>
        </div>
      )}
    </div>
  );
}
