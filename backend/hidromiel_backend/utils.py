import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError
from django.http import Http404

logger = logging.getLogger('api')

def custom_exception_handler(exc, context):
    """
    Custom exception handler for REST framework that handles additional exceptions.
    """
    response = exception_handler(exc, context)

    if response is None:
        if isinstance(exc, ValidationError):
            response = Response({
                'error': 'Validation Error',
                'detail': exc.messages
            }, status=status.HTTP_400_BAD_REQUEST)
        elif isinstance(exc, Http404):
            response = Response({
                'error': 'Not Found',
                'detail': str(exc)
            }, status=status.HTTP_404_NOT_FOUND)
        else:
            logger.error(f"Unhandled exception: {exc}", exc_info=True)
            response = Response({
                'error': 'Internal Server Error',
                'detail': 'An unexpected error occurred'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Log all errors with context
    logger.error(f"Exception in {context['view'].__class__.__name__}: {exc}",
                extra={
                    'status_code': response.status_code,
                    'view': context['view'].__class__.__name__,
                    'user': getattr(context['request'].user, 'id', None),
                    'path': context['request'].path
                })

    return response
