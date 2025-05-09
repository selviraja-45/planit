import React, { useEffect, useState } from 'react';
import { Button, Card, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import API from '../../api';

const ActivityList = ({ tripId, userId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/trips/${tripId}/activities`);
      setActivities(res.data);
    } catch (err) {
      setError('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (activityId) => {
    try {
      await API.delete(`/activities/${activityId}`);
      setActivities(prev => prev.filter(a => a._id !== activityId));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleEditSubmit = async () => {
    try {
      await API.put(`/activities/${editData._id}`, editData);
      setActivities(prev => prev.map(a => a._id === editData._id ? editData : a));
      setShowEditModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const handleEditOpen = (activity) => {
    setEditData({ ...activity });
    setShowEditModal(true);
  };

  useEffect(() => {
    fetchActivities();
  }, [tripId]);

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <h4>Activities</h4>
      {activities.map(activity => (
        <Card key={activity._id} className="mb-3">
          <Card.Body>
            <Card.Title>{activity.title}</Card.Title>
            <Card.Text>
              {activity.category} | {new Date(activity.dateTime).toLocaleString()}<br />
              Estimated Cost: ₹{activity.estimatedCost}<br />
              Notes: {activity.notes}
            </Card.Text>
            <div className="d-flex gap-2">
              <Button variant="outline-primary" onClick={() => handleEditOpen(activity)}>Edit</Button>
              {activity.createdBy === userId && (
                <Button variant="outline-danger" onClick={() => handleDelete(activity._id)}>Delete</Button>
              )}
            </div>
          </Card.Body>
        </Card>
      ))}

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Activity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editData?.title || ''}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={editData?.category || ''}
                onChange={(e) => setEditData({ ...editData, category: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={new Date(editData?.dateTime).toISOString().slice(0,16)}
                onChange={(e) => setEditData({ ...editData, dateTime: new Date(e.target.value).toISOString() })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Estimated Cost</Form.Label>
              <Form.Control
                type="number"
                value={editData?.estimatedCost || ''}
                onChange={(e) => setEditData({ ...editData, estimatedCost: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                value={editData?.notes || ''}
                onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleEditSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ActivityList;
