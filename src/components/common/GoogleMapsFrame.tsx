export default function GoogleMapsFrame()
{
    return (
        <div className="rounded-lg overflow-hidden shadow-md h-[400px] bg-gray-100 dark:bg-gray-800">
            <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3980.976637941206!2d11.561531474581715!3d3.8151248961587063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bdada2efd3d7f%3A0x1bd8835e17b0b8aa!2sInstitut%20Saint%20Jean!5e0!3m2!1sfr!2sfr!4v1756907056427!5m2!1sfr!2sfr"
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Localisation de la résidence Eureka"
            className="dark:opacity-90"
            ></iframe>
        </div>
    );
}