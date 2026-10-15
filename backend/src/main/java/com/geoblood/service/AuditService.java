package com.geoblood.service;

import com.geoblood.entity.AuditEvent;
import com.geoblood.repository.AuditEventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditService {

    private static final Logger logger = LoggerFactory.getLogger(AuditService.class);
    private final AuditEventRepository auditEventRepository;

    public AuditService(AuditEventRepository auditEventRepository) {
        this.auditEventRepository = auditEventRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void log(Long actorId, String actorEmail, String action, String targetType, String targetId, String details) {
        try {
            AuditEvent event = new AuditEvent(actorId, actorEmail, action, targetType, targetId, details);
            auditEventRepository.save(event);
        } catch (Exception ex) {
            logger.error("Failed to persist audit event: action={}, actor={}", action, actorEmail, ex);
        }
    }
}
