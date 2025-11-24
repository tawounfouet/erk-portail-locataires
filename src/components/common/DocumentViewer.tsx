import { getFileIcon } from "@/lib/icons";
import { IDocument } from "@/types/docs.type";
import { formatDashDateToSlashDate } from "@/lib/date";
import { Download, FileText, X } from "lucide-react";

interface IDocumentViewerProps
{
    selectedDocument: IDocument | null;
    onCloseViewer: () => void
}

export default function DocumentViewer({ selectedDocument, onCloseViewer }: IDocumentViewerProps) {
    if (!selectedDocument) return null;

    const handleDownload = (doc: IDocument) => {
        // Create a temporary link for downloading
        const link = document.createElement('a');
        
        link.href = doc.url;
        link.download = `${doc.name}.pdf`;
        link.target = '_blank';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const closeViewer = () => {
        onCloseViewer();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center gap-3">
              {getFileIcon(selectedDocument.filetype)}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedDocument.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedDocument.size} • {formatDashDateToSlashDate(selectedDocument.date)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDownload(selectedDocument)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Télécharger"
              >
                <Download size={20} />
              </button>
              <button
                onClick={closeViewer}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 overflow-auto">
            {selectedDocument.filetype === 'pdf' ? (
              <div className="w-full h-full">
                <iframe
                  src={selectedDocument.url}
                  className="w-full h-full border-0 rounded-lg"
                  title={selectedDocument.name}
                />
              </div>
            ) : selectedDocument.filetype === 'image' ? (
              <div className="flex justify-center items-center h-full">
                <img
                  src={selectedDocument.url}
                  alt={selectedDocument.name}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <FileText size={64} className="mb-4" />
                <p className="text-lg">Prévisualisation non disponible</p>
                <p className="text-sm">Cliquez sur télécharger pour ouvrir le fichier</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };