// components/forms/ContactForm.tsx
import React, { useState } from 'react';
import { Send, Check, AlertTriangle } from 'lucide-react';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  residenceInterest: string;
}

export interface ContactFormProps {
  onSubmit?: (formData: ContactFormData) => Promise<void>;
  initialData?: Partial<ContactFormData>;
  showSuccessMessage?: boolean;
  onSuccess?: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  initialData = {},
  showSuccessMessage = true,
  onSuccess
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    residenceInterest: 'aucune',
    ...initialData
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "Veuillez entrer votre nom";
    if (!formData.email.trim()) newErrors.email = "Veuillez entrer votre email";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Veuillez entrer un email valide";
    if (!formData.subject.trim()) newErrors.subject = "Veuillez sélectionner un sujet";
    if (!formData.message.trim()) newErrors.message = "Veuillez entrer votre message";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setStatus('loading');
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default behavior - simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      setStatus('success');
      if (onSuccess) onSuccess();
      
      // Reset form after success if no custom onSubmit
      if (!onSubmit) {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          residenceInterest: 'aucune'
        });
      }
    } catch (error) {
      setStatus('error');
    }
  };

  if (status === 'success' && showSuccessMessage) {
    return (
      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full mb-4">
          <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">Message envoyé avec succès</h3>
        <p className="text-green-600 dark:text-green-400 mb-4">
          Merci de nous avoir contactés ! Nous vous répondrons dans les plus brefs délais.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nom complet *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#F7BF57] focus:border-transparent ${
              errors.name ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
            placeholder="Jean Dupont"
          />
          {errors.name && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#F7BF57] focus:border-transparent ${
              errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
            placeholder="email@exemple.com"
          />
          {errors.email && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.email}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Téléphone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#F7BF57] focus:border-transparent"
            placeholder="+237 XX XX XX XX"
          />
        </div>
        
        <div>
          <label htmlFor="residenceInterest" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Résidence qui vous intéresse
          </label>
          <select
            id="residenceInterest"
            name="residenceInterest"
            value={formData.residenceInterest}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#F7BF57] focus:border-transparent"
          >
            <option value="aucune">Aucune en particulier</option>
            <option value="residence-eureka">Résidence Eureka</option>
            <option value="residence-alpha">Résidence Alpha</option>
            <option value="residence-beta">Résidence Beta</option>
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Sujet *
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#F7BF57] focus:border-transparent ${
            errors.subject ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Sélectionner un sujet</option>
          <option value="information">Demande d'information</option>
          <option value="reservation">Réservation</option>
          <option value="reclamation">Réclamation</option>
          <option value="autre">Autre</option>
        </select>
        {errors.subject && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.subject}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#F7BF57] focus:border-transparent ${
            errors.message ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
          }`}
          placeholder="Écrivez votre message ici..."
        />
        {errors.message && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.message}</p>
        )}
      </div>
      
      {status === 'error' && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
          <p className="text-red-600 dark:text-red-400">
            Une erreur s'est produite lors de l'envoi de votre message. Veuillez réessayer.
          </p>
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`flex items-center px-6 py-3 bg-[#F7BF57] hover:bg-[#e6af4a] text-white rounded-lg transition-colors
            ${status === 'loading' ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {status === 'loading' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
              Envoi en cours...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Envoyer le message
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;