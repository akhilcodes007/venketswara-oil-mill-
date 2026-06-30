import supabase from '../config/supabase.js';

export async function getNotifications(req, res) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    res.status(200).json(data || []);
  } catch (error) {
    console.error('[Notification] getNotifications error:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
}

export async function markAsRead(req, res) {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json(data);
  } catch (error) {
    console.error('[Notification] markAsRead error:', error);
    res.status(500).json({ message: 'Error marking notification as read' });
  }
}

export async function markAllRead(req, res) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('is_read', false);

    if (error) throw error;
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('[Notification] markAllRead error:', error);
    res.status(500).json({ message: 'Error marking notifications' });
  }
}
