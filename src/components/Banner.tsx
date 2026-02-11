import bannerImg from "@/assets/banner.jpg";

export const Banner = () => {
  return (
    <div className="w-full h-48 md:h-64 lg:h-80 overflow-hidden relative border-b">
      <img 
        src={bannerImg} 
        alt="Schachklub Bern Banner" 
        className="w-full h-full object-cover object-center"
      />
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Club Name Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-medium tracking-[0.25em] uppercase opacity-90 drop-shadow-lg">
          Schachklub Bern
        </h1>
      </div>
    </div>
  );
};
