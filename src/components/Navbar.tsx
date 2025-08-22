import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-100 p-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Inicio
          </Link>
          <Link href="/copropiedad-fraccional" className="text-blue-600 hover:text-blue-800">
            ¿Qué es Copropiedad?
          </Link>
          <Link href="/propiedad-alfa" className="text-blue-600 hover:text-blue-800">
            Propiedad Alfa
          </Link>
          <Link href="/la-propuesta" className="text-blue-600 hover:text-blue-800">
            La Propuesta
          </Link>
        </div>
        <div className="flex space-x-4">
          <Link href="/login" className="text-blue-600 hover:text-blue-800">
            Iniciar Sesión
          </Link>
          <Link href="/registro" className="text-blue-600 hover:text-blue-800">
            Registro
          </Link>
        </div>
      </div>
    </nav>
  );
}