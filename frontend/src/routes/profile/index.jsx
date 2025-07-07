import { useEffect, useState } from "react";
import ExpandableCardDemo from "../../components/ExpandableCardDemo"
import { useAuth } from "../../contexts/AuthContext";
const ProfileRoute = ({}) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const { user, token } = useAuth();
    
    const [sales, setSales] = useState([])
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchSales = async () => {
            try{
                const response = await fetch(`${API_BASE_URL}/api/sales/sales?user=${user.id}`,{
                    method:'GET',
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                })
                if(!response.ok){
                    throw new Error('Failed to fetch user sales')
                }

                const data = await response.json();
                setSales(data.sales)
            }catch(error){
                console.error('Error fetching sales:', error)
            }finally{
                setLoading(false)

            }
        }

        const fetchEvents = async() => {
            try{
                const response = await fetch(`${API_BASE_URL}/api/user-events?user=${user.id}`,{
                    method:'GET',
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                })
                if(!response.ok){
                    throw new Error('Failed to fetch user events')
                }

                const data = await response.json();
                setEvents(data.events)
            }catch(error){
                console.error('Error fetching events:', error)
            }finally{
                setLoading(false)
            }
        }

    useEffect(() => {
        console.log("fetching sales")
        fetchSales()
        fetchEvents()
    },[])

    if (loading) return <div>Loading...</div>;


    return (
         <div className="w-full">
            <ExpandableCardDemo isProfile={true} fetchSales={fetchSales} fetchEvents={fetchEvents} sales={sales} events={events} />
    </div>
    )
}

export default ProfileRoute;
