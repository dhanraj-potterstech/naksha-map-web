import React from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../store/authSlice'

export const useAuth = () => {
    const user = useSelector(selectCurrentUser)

    return React.useMemo(() => ({ user }), [user])
}
