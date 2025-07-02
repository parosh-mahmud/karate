// // components/ResultsGallery.jsx
// import { useState, useEffect } from "react";
// import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
// import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/Page/AnnotationLayer.css";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// export default function ResultsGallery({ folderPath = "results" }) {
//   const [pdfFiles, setPdfFiles] = useState([]); // [{ name, url }]
//   const [numPagesMap, setNumPagesMap] = useState({}); // { fileName: numPages }

//   useEffect(() => {
//     async function fetchPDFs() {
//       const storage = getStorage();
//       // Point to the folder where you uploaded all PDFs
//       const listRef = ref(storage, folderPath + "/");
//       const res = await listAll(listRef);

//       const files = await Promise.all(
//         res.items.map(async (itemRef) => {
//           const url = await getDownloadURL(itemRef);
//           return { name: itemRef.name, url };
//         })
//       );

//       // Sort by file name or whatever you like:
//       files.sort((a, b) => a.name.localeCompare(b.name));

//       setPdfFiles(files);
//     }

//     fetchPDFs().catch(console.error);
//   }, [folderPath]);

//   return (
//     <div className="space-y-12">
//       {pdfFiles.map(({ name, url }) => (
//         <div key={name}>
//           <h2 className="text-xl font-semibold mb-4">{name}</h2>
//           <Document
//             file={url}
//             onLoadSuccess={({ numPages }) =>
//               setNumPagesMap((m) => ({ ...m, [name]: numPages }))
//             }
//             loading={<p>Loading {name}…</p>}
//             className="border rounded-lg overflow-hidden"
//           >
//             {Array.from({ length: numPagesMap[name] || 0 }, (_, i) => (
//               <Page key={i} pageNumber={i + 1} width={800} loading={null} />
//             ))}
//           </Document>
//         </div>
//       ))}
//     </div>
//   );
// }

// components/ResultsGallery.jsx
import React from "react";

const pdfFiles = [
  {
    name: "BM Hall Result.pdf",
    url: "https://firebasestorage.googleapis.com/v0/b/jkcombat-27a89.firebasestorage.app/o/results%2FBM%20Hall%20Result.pdf?alt=media&token=f0f1622b-cf97-424d-9938-0940cd57949c",
  },
  {
    name: "Kuwait Maitree Result.pdf",
    url: "https://firebasestorage.googleapis.com/v0/b/jkcombat-27a89.firebasestorage.app/o/results%2FKuwait%20Maitree%20Result.pdf?alt=media&token=YOUR_TOKEN_HERE",
  },
  {
    name: "Roqqiya Hall Result.pdf",
    url: "https://firebasestorage.googleapis.com/v0/b/jkcombat-27a89.firebasestorage.app/o/results%2FRoqqiya%20Hall%20Result.pdf?alt=media&token=YOUR_TOKEN_HERE",
  },
  {
    name: "Shamsunnahar Hall Result.pdf",
    url: "https://firebasestorage.googleapis.com/v0/b/jkcombat-27a89.firebasestorage.app/o/results%2FShamsunnahar%20Hall%20Result.pdf?alt=media&token=YOUR_TOKEN_HERE",
  },
  {
    name: "Sufia Kamal Hall Result.pdf",
    url: "https://firebasestorage.googleapis.com/v0/b/jkcombat-27a89.firebasestorage.app/o/results%2Fsufia%20kamal%20hall%20Result.pdf?alt=media&token=a2ef36d2-fcc1-41d8-9c08-451068a5e723",
  },
];

export default function ResultsGallery() {
  return (
    <div className="space-y-12 px-4 sm:px-6 lg:px-8">
      {pdfFiles.map(({ name, url }) => (
        <div key={name} className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">{name}</h2>
          <iframe
            src={url}
            width="100%"
            height="600"
            className="border rounded-lg"
            title={name}
          />
        </div>
      ))}
    </div>
  );
}
