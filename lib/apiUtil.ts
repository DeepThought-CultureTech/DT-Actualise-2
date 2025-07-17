import axios from 'axios';

export const updateUserStatus = async (userId: string, newStatus: string, update: (user: object) => any) => {
  try {
    const response = await axios({
      url: '/api/v1/user/status',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        userId,
        newStatus
      }
    });

    if (response.status !== 200) {
      // TODO: add notification toasts to show API failure
      return false;
    }

    await update({ user: { status: newStatus } });
    
    // TODO: add notification toast to show API success
    return true;
  } catch (error) {
    console.error('Error updating user status:', error);
    // TODO: add notification toast to show API error
    return false;
  }
};