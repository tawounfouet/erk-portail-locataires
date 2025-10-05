interface IYoutubeFrameProps
{
    src: string;
    title: string;
}


export default function YoutubeFrame({ src, title }: IYoutubeFrameProps)
{
    return (
        <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
            <iframe
                src={src}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-[400px]"
            ></iframe>
        </div>
    );
}