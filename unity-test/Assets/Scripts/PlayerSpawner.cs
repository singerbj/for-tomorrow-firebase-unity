using System;
using System.Collections.Generic;
using Fusion;
using Fusion.Sockets;
using UnityEngine;

public class PlayerSpawner : MonoBehaviour, INetworkRunnerCallbacks
{
    [SerializeField] private Player _playerPrefab;

    InputData _data;

    private void Update() // Check events like KeyDown or KeyUp in Unity's update. They might be missed otherwise
    {
        _data.Actions ^= Input.GetKeyDown(KeyCode.R) ? InputAction.RESPAWN : 0; // xor the actions to flip the bit
        _data.Actions ^= Input.GetKeyDown(KeyCode.LeftShift) ? InputAction.BOOST : 0;
        _data.Actions ^= Input.GetKeyDown(KeyCode.Space) ? InputAction.JUMP : 0;
        _data.Actions ^= Input.GetKeyDown(KeyCode.P) ? InputAction.SPAWN : 0;
        _data.Actions ^= Input.GetMouseButtonDown(0) ? InputAction.FIRE : 0;
    }

    public void OnPlayerJoined(NetworkRunner runner, PlayerRef player)
    {
        print("player joined!");
        System.Random rnd = new System.Random();
        runner.Spawn(_playerPrefab, new Vector3(rnd.Next(-7, 8), 5, rnd.Next(-7, 8)), null, player);
    }

    public void OnPlayerLeft(NetworkRunner runner, PlayerRef player)
    {
    }

    public void OnInput(NetworkRunner runner, NetworkInput input)
    {
        _data.States |= Input.GetKey(KeyCode.W) ? InputState.FORWARD : 0;
        _data.States |= Input.GetKey(KeyCode.A) ? InputState.LEFT : 0;
        _data.States |= Input.GetKey(KeyCode.S) ? InputState.BACKWARD : 0;
        _data.States |= Input.GetKey(KeyCode.D) ? InputState.RIGHT : 0;

        input.Set(_data);

        _data.States = 0;
    }

    public void OnConnectedToServer(NetworkRunner runner)
    {
        if (runner.Topology == SimulationConfig.Topologies.Shared)
            runner.Spawn(_playerPrefab, null, null, runner.LocalPlayer);
    }

    public void OnInputMissing(NetworkRunner runner, PlayerRef player, NetworkInput input) { }
    public void OnShutdown(NetworkRunner runner, ShutdownReason shutdownReason) { }
    public void OnDisconnectedFromServer(NetworkRunner runner) { }
    public void OnConnectRequest(NetworkRunner runner, NetworkRunnerCallbackArgs.ConnectRequest request, byte[] token) { }
    public void OnConnectFailed(NetworkRunner runner, NetAddress remoteAddress, NetConnectFailedReason reason) { }
    public void OnUserSimulationMessage(NetworkRunner runner, SimulationMessagePtr message) { }
    public void OnSessionListUpdated(NetworkRunner runner, List<SessionInfo> sessionList) { }
    public void OnCustomAuthenticationResponse(NetworkRunner runner, Dictionary<string, object> data) { }
    public void OnReliableDataReceived(NetworkRunner runner, PlayerRef player, ArraySegment<byte> data) { }
    public void OnSceneLoadDone(NetworkRunner runner) { }
    public void OnSceneLoadStart(NetworkRunner runner) { }
}
