import AdminNav from "@/components/AdminNav"
import SideBr from "@/components/SideBr"

const RootLayout = ({children}) => {
  return (
    <main className ="dashboard">
      <div className="dashboard_container">
        <SideBr />
        <div className="dashboard_pages">
          <AdminNav />
          {children}
        </div>
      </div>
    </main>
  )
}

export default RootLayout