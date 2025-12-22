import { useEffect, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export interface IUploadedFile {
	id: string;
	name: string;
	url: string;
	size: number;
	file: File;
}

interface IFileUploaderProps
{
    label: string;
    description: string;
    subDescription: string;
    acceptedFileType: string;
    maxSize: number; /** in MB or Mo */

    files: IUploadedFile[];
    onFilesChange: (files: IUploadedFile[]) => void;
}

/**
 * FileUploader component - A robust and controlled file upload field.
 * 
 * This component allows you to select multiple files, display a preview 
 * (for images), and manage a cumulative size limit. 
 * It does not handle the HTTP upload itself, but exposes the files to the parent via `onFilesChange`.
 * 
 * @param {string} label - Title displayed above the field (e.g., “Supporting Documents”).
 * @param {string} description - Main instruction text in the drop zone.
 * @param {string} subDescription - Secondary text (e.g., “Accepted formats: PDF, PNG”).
 * @param {string} acceptedFileType - HTML filter for file types (e.g., “image/*” or “.pdf”).
 * @param {number} maxSize - Maximum cumulative size allowed in MB (e.g., 4).
 * @param {IUploadedFile[]} files - The current status of the files (passed by the parent).
 * @param {(files: IUploadedFile[]) => void} onFilesChange - Callback triggered when files are added or removed.
 * 
 * @example
 * const [myFiles, setMyFiles] = useState<IUploadedFile[]>([]);
 * 
 * <FileUploader 
 *    label="Disaster photos"
 *    maxSize={5}
 *    files={myFiles}
 *    onFilesChange={setMyFiles}
 *    acceptedFileType="image/*"
 *    description="Click here to add photos"
 *    subDescription="Maximum 5MB total"
 * />
 */
export default function FileUploader({ 
    label, description, subDescription, 
    acceptedFileType, maxSize, files, onFilesChange 
}: IFileUploaderProps)
{
	// Cleanup of URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            files.forEach(file => URL.revokeObjectURL(file.url));
        };
    }, []);

	// ==========================================
	// 				    STATE 
	// ==========================================
	const [error, setError] = useState<string>('');

	// ==========================================
	// 				 COMPUTATION 
	// ==========================================
	const removePhoto = (id: string) => {
        const fileToRemove = files.find(f => f.id === id);

        if (fileToRemove) URL.revokeObjectURL(fileToRemove.url);
		
		onFilesChange(files.filter(file => file.id !== id));
		setError('');
	};
	
	const MAX_SIZE = maxSize * 1024 * 1024; // in bytes

	const calculateTotalSize = (files: IUploadedFile[]) => {
		return files.reduce((total, file) => total + file.size, 0);
	};

	const formatSize = (bytes: number) => {
		return (bytes / (1024 * 1024)).toFixed(2) + ' Mo';
	};

	const totalSize = calculateTotalSize(files);
	const remainingSize = MAX_SIZE - totalSize;
	const percentageUsed = (totalSize / MAX_SIZE) * 100;

	// ==========================================
	// 				 FORM HANDLERS
	// ==========================================
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newFiles = Array.from(e.target.files || []);
		const newUploadedFiles: IUploadedFile[] = newFiles.map(file => ({
			id: Math.random().toString(36).substr(2, 9),
			name: file.name,
			url: URL.createObjectURL(file),
			file: file,
			size: file.size
		}));
		
		if (newUploadedFiles.length !== newFiles.length) 
        {

			setError('Vous avez insérez le mauvais type de document.');
			return;
		}

		const combinedFiles = [...files, ...newUploadedFiles];
		const totalSize = calculateTotalSize(combinedFiles);

		if (totalSize > MAX_SIZE)
        {
			setError(`La taille totale dépasse ${maxSize} Mo. Taille actuelle: ${formatSize(totalSize)}`);
            newUploadedFiles.forEach(file => URL.revokeObjectURL(file.url));
			return;
		}

		onFilesChange(combinedFiles);
		setError('');
		e.target.value = '';
	};


	return (
		<div className="space-y-2 text-gray-300">
			<Label htmlFor="fileUploader">{label} (max {maxSize}Mo)</Label>

			{/* Progress bar */}
			{files.length > 0 && (
				<div>
				<div className="flex justify-between text-sm text-gray-600 mb-2">
					<span>Espace utilisé: {formatSize(totalSize)} / 4 Mo</span>
					<span>{percentageUsed.toFixed(1)}%</span>
				</div>
				<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
					<div
					className={`h-full transition-all duration-300 ${
						percentageUsed > 90 ? 'bg-red-500' : percentageUsed > 70 ? 'bg-yellow-500' : 'bg-green-500'
					}`}
					style={{ width: `${Math.min(percentageUsed, 100)}%` }}
					/>
				</div>
				<p className="text-xs text-gray-500 mt-1">
					Espace restant: {formatSize(remainingSize)}
				</p>
				</div>
			)}
			<div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
				<input
					type="file"
					accept={acceptedFileType}
					multiple
					onChange={handleFileChange}
					className="hidden"
					id="fileUploader"
				/>
				<label
					htmlFor="fileUploader"
					className="cursor-pointer flex flex-col items-center gap-2"
				>
					<Upload className="w-10 h-10 text-muted-foreground" />
					<span className="text-sm font-medium text-muted-foreground">
						{description}
					</span>
					<span className="text-xs text-muted-foreground">
						{subDescription}
					</span>
				</label>
			</div>

			{/* Error message */}
			{error && (
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{/* Files preview */}
			{files.length > 0 && (
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
					{files.map(photo => (
						<div key={photo.id} className="relative group">
							<img
								src={photo.url}
								alt={photo.name}
								className="w-full h-32 object-cover rounded-lg border-2 border-border"
							/>
							<Button
								type="button"
								variant="destructive"
								size="icon"
								className="absolute top-2 right-2 h-6 w-6"
								onClick={() => removePhoto(photo.id)}
							>
								<X className="h-4 w-4" />
							</Button>
							<p className="text-xs text-muted-foreground mt-1 truncate">
								{photo.name}
							</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
}