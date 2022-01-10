using UnityEngine;
using Fusion;

public class Player : NetworkBehaviour
{
    public static Player Local { get; set; }

    [SerializeField] private Transform _cameraTarget;

    public override void Spawned()
    {
        if (Object.HasInputAuthority)
        {
            Local = this;
            PlayerCamera camera = FindObjectOfType<PlayerCamera>();
            // camera.CameraTarget = _cameraTarget;
            // camera.player = this;

            camera.transform.position = transform.position;
            camera.transform.localPosition = transform.position;

            Cursor.lockState = CursorLockMode.Locked;
        }
    }

    [Rpc(RpcSources.All, RpcTargets.StateAuthority)]
    public void RpcPlayerQuit(RpcInfo info = default)
    {
        Debug.Log("Disconnect RPC called." + info.Source);
        if (info.Source == Object.StateAuthority)
        {
            Debug.Log("Disconnecting Server.");
            return;
        }

        Runner.Disconnect(info.Source);
    }
}