import { AuthStep } from '@/components/AuthStep'

const RootLayout = ({children}) => {
  return (
    <main className ="auth">
        <div className='sign_left'>
          <AuthStep />
        </div>
        <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            {children}
          </div>
        </section>
    </main>
  )
}

export default RootLayout