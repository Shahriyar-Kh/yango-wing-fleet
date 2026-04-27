from rest_framework.response import Response


def api_success(data=None, message="Success", status_code=200):
    return Response({"success": True, "message": message, "data": data}, status=status_code)


def api_error(message="Error", errors=None, status_code=400):
    payload = {"success": False, "message": message}
    if errors is not None:
        payload["errors"] = errors
    return Response(payload, status=status_code)
