import Image from 'next/image';

const Logo = () => {
  return (
    <div className="w-10 h-10 relative flex items-center justify-center">
      <Image
        src="/periskope_logo.svg"
        alt="Logo"
        layout="fill"
        objectFit="contain"
        priority
      />
    </div>
  );
};

export default Logo;