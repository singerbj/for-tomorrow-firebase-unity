using UnityEngine;
using System.Collections;

public class QuitGameButton : MonoBehaviour
{
    public void OnClick()
    {
        var player = Player.Local;
        Debug.Log("Player: " + player);
        if (player != null)
        {
            player.RpcPlayerQuit();
            StartCoroutine(QuitRoutine());
        }
    }

    IEnumerator QuitRoutine()
    {
        yield return new WaitForSecondsRealtime(0.5f);
        Application.Quit();
    }
}