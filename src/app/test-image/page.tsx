import Image from 'next/image';

export default function TestImagePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image Test Page</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Test 1: Next.js Image Component</h2>
          <Image
            src="/media/isa.webp"
            alt="Test Image"
            width={300}
            height={400}
            className="border border-gray-300"
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Test 2: Regular HTML img tag</h2>
          <img
            src="/media/isa.webp"
            alt="Test Image HTML"
            width={300}
            height={400}
            className="border border-gray-300"
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Test 3: Image with Fill</h2>
          <div className="relative w-64 h-64 border border-gray-300">
            <Image
              src="/media/isa.webp"
              alt="Test Image Fill"
              fill
              className="object-cover"
            />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Test 4: External Image</h2>
          <Image
            src="https://via.placeholder.com/300x200"
            alt="Placeholder"
            width={300}
            height={200}
            className="border border-gray-300"
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Test 5: Local Logo</h2>
          <Image
            src="/logo.png"
            alt="Logo"
            width={100}
            height={100}
            className="border border-gray-300"
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Test 6: Property Image</h2>
          <Image
            src="/media/DSC01806 HDR June 25 2025/DSC01817-HDR.jpg"
            alt="Property Image"
            width={300}
            height={200}
            className="border border-gray-300 object-cover"
          />
        </div>
      </div>
    </div>
  );
}
