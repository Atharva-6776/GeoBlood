import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestsApi } from '../../api/requests';
import { parseApiError } from '../../utils/errorHandler';
import { useToast } from '../../context/ToastContext';
import {
  BLOOD_GROUPS,
  BLOOD_COMPONENTS,
  URGENCY_LEVELS,
  isValidQuantity
} from '../../utils/validators';

import PageHeader from '../../components/PageHeader';
import FormInput from '../../components/FormInput';
import Select from '../../components/Select';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';

export const CreateRequestPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    bloodGroup: '',
    bloodComponent: 'Whole Blood',
    unitsNeeded: '1',
    urgency: 'HIGH',
    hospitalLocation: 'City Care Emergency Hospital, Mumbai - Central Trauma Ward',
    patientRef: '',
    notes: ''
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setFieldErrors({});

    // Client-side validations
    const errors = {};
    if (!formData.bloodGroup) {
      errors.bloodGroup = 'Please select the required blood group';
    }
    if (!formData.bloodComponent) {
      errors.bloodComponent = 'Please select blood component type';
    }
    if (!isValidQuantity(formData.unitsNeeded)) {
      errors.unitsNeeded = 'Quantity must be a positive whole number (between 1 and 50)';
    }
    if (!formData.urgency) {
      errors.urgency = 'Please select urgency tier';
    }
    if (!formData.hospitalLocation.trim()) {
      errors.hospitalLocation = 'Hospital receiving address and ward location are required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error('Please resolve the highlighted form errors.');
      return;
    }

    setIsSubmitting(true);

    try {
      const created = await requestsApi.createRequest({
        bloodGroup: formData.bloodGroup,
        bloodComponent: formData.bloodComponent,
        unitsNeeded: Number(formData.unitsNeeded),
        urgency: formData.urgency,
        hospitalLocation: formData.hospitalLocation.trim(),
        patientRef: formData.patientRef.trim(),
        notes: formData.notes.trim()
      });

      toast.success('Emergency blood request created! Candidate matching initiated.');
      navigate(`/hospital/requests/${created.id}`);
    } catch (err) {
      const parsed = parseApiError(err);
      setGeneralError(parsed.message);
      setFieldErrors(parsed.fieldErrors || {});
      toast.error(parsed.message || 'Failed to create request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container page-narrow">
      <PageHeader
        title="Create Emergency Blood Request"
        subtitle="Initiate proximity-based discovery and alert nearby eligible voluntary donors."
        backTo="/hospital"
      />

      {/* Mandatory Coordination Notice on Request Page */}
      <div className="disclaimer-callout" role="note" style={{ marginBottom: '1.5rem' }}>
        <strong>⚠️ Clinical & Coordination Notice:</strong>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>
          This application supports emergency donor discovery and coordination only. It does not replace
          hospital blood-bank protocols, cross-matching validation, or medical judgment.
        </p>
      </div>

      {generalError && <ErrorMessage message={generalError} />}

      <div className="card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid-2col-compact">
            <Select
              label="Blood Group Needed"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              options={BLOOD_GROUPS}
              placeholder="Select blood group..."
              required
              error={fieldErrors.bloodGroup}
              disabled={isSubmitting}
            />

            <Select
              label="Component Type"
              name="bloodComponent"
              value={formData.bloodComponent}
              onChange={handleChange}
              options={BLOOD_COMPONENTS}
              placeholder="Select component..."
              required
              error={fieldErrors.bloodComponent}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid-2col-compact">
            <FormInput
              label="Units Required"
              name="unitsNeeded"
              type="number"
              min="1"
              max="50"
              value={formData.unitsNeeded}
              onChange={handleChange}
              placeholder="e.g. 2"
              required
              helperText="Whole integer bags needed"
              error={fieldErrors.unitsNeeded}
              disabled={isSubmitting}
            />

            <Select
              label="Urgency Classification"
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              options={URGENCY_LEVELS}
              required
              error={fieldErrors.urgency}
              disabled={isSubmitting}
            />
          </div>

          <FormInput
            label="Hospital Receiving Location & Ward"
            name="hospitalLocation"
            value={formData.hospitalLocation}
            onChange={handleChange}
            placeholder="Hospital name, department, ward or room"
            required
            helperText="Where the donor must report upon arrival"
            error={fieldErrors.hospitalLocation}
            disabled={isSubmitting}
          />

          <FormInput
            label="Patient / Case Reference (Confidential)"
            name="patientRef"
            value={formData.patientRef}
            onChange={handleChange}
            placeholder="e.g. OT-2 / Emergency Case #741"
            helperText="Internal hospital identifier for specimen cross-matching"
            error={fieldErrors.patientRef}
            disabled={isSubmitting}
          />

          <div className="form-group">
            <label htmlFor="notes">Clinical / Special Instructions (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Special instructions for donors regarding entry gate, contact desk, or timing..."
              disabled={isSubmitting}
            />
          </div>

          <div className="form-actions-row">
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate('/hospital')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={isSubmitting}
            >
              {isSubmitting ? 'Matching Candidates...' : '🚀 Broadcast Emergency Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRequestPage;
