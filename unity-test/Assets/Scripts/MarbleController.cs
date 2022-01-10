using UnityEngine;
using UnityEngine.UI;
using Fusion;
using System.Reflection;


[RequireComponent(typeof(Rigidbody), typeof(NetworkRigidbody))]
public class MarbleController : NetworkBehaviour
{
    Rigidbody _body;
    GameObject _camera;
    Transform _gunTransform;
    GameObject _healthText;
    BoostAnimation _boostAnim;
    Vector3 jump;
    public float jumpForce = 2.0f;
    public float maxSpeed = 5.0f;
    public float shotDistance = 100f;
    public LineRenderer lineRenderer;

    [Networked]
    TickTimer _boostCooldown { get; set; }
    [Networked]
    InputAction _previousInputActions { get; set; }

    [SerializeField] NetworkObject _cubePrefab;
    [SerializeField] float _movementSpeed = 60f;
    [SerializeField] float _boostFactor = 500f;
    [SerializeField] float _boostCooldownInSeconds = 2f;
    [SerializeField] float _areaOfInterestRadius = 5f;
    [SerializeField] bool _isGrounded = true;
    [SerializeField] float sensitivity = 200f;
    // [SerializeField] float camMoveSpeed = 100f;
    [SerializeField] float xRotation = 0f;
    [SerializeField] float yRotation = 0f;

    [SerializeField] float health = 100;


    void Start()
    {
        jump = new Vector3(0.0f, 20.0f, 0.0f);
    }

    private void Awake()
    {
        _boostAnim = GetComponent<BoostAnimation>();
        _body = GetComponent<Rigidbody>();
        _gunTransform = transform.Find("Gun");
        _camera = GameObject.Find("LocalPlayerSystem/PlayerCameraRoot/Camera");
        _camera = GameObject.Find("LocalPlayerSystem/PlayerCameraRoot/Camera");

        GameObject localPlayerSystem = GameObject.Find("LocalPlayerSystem");
        _healthText = GameObject.Find("LocalPlayerSystem/Canvas/HealthText");
        lineRenderer = localPlayerSystem.GetComponent<LineRenderer>();
    }

    public override void Spawned()
    {
        Runner.SetPlayerAlwaysInterested(Object.InputAuthority, Object, true);
    }

    public override void FixedUpdateNetwork()
    {
        Runner.AddPlayerAreaOfInterest(Object.InputAuthority, transform.position, _areaOfInterestRadius);
        if (GetInput<InputData>(out var input))
        {
            PreprocessInput(ref input);
            UpdateRespawn(input);
            UpdateMovement(input);
            UpdateActions(input);
            UpdateSpawn(input);
        }
    }

    void PreprocessInput(ref InputData input)
    {
        _previousInputActions = input.Preprocess(_previousInputActions);
    }


    // private void LateUpdate()
    // {
    //     if (Object.HasInputAuthority)
    //     {
    //         // _camera.transform.localPosition = Vector3.Lerp(_body.transform.position, new Vector3(_body.transform.position.x, _body.transform.position.y + 0.75f, _body.transform.position.z), camMoveSpeed * Time.deltaTime);
    //         // _camera.transform.localPosition = new Vector3(_body.transform.position.x, _body.transform.position.y + 0.75f, _body.transform.position.z);
    //     }
    // }

    private void Update()
    {
        if (Object.HasInputAuthority)
        {
            // _camera.transform.localPosition = Vector3.Lerp(_body.transform.position, new Vector3(_body.transform.position.x, _body.transform.position.y + 0.75f, _body.transform.position.z), camMoveSpeed * Time.deltaTime);
            _camera.transform.localPosition = new Vector3(_body.transform.position.x, _body.transform.position.y + 0.75f, _body.transform.position.z);

            float mouseX = Input.GetAxis("Mouse X") * sensitivity * Time.deltaTime;
            float mouseY = Input.GetAxis("Mouse Y") * sensitivity * Time.deltaTime;

            xRotation -= mouseY;
            xRotation = Mathf.Clamp(xRotation, -90f, 90f);

            yRotation -= mouseX;

            _camera.transform.localRotation = Quaternion.Euler(xRotation, -yRotation, 0f);

            RpcRotatePlayerAndGun(Runner.LocalPlayer, Vector3.up * mouseX, Vector3.left * mouseY);

            _healthText.GetComponent<Text>().text = "Health: " + health;
        }
    }

    void UpdateMovement(InputData input)
    {
        float speed = _movementSpeed * Runner.DeltaTime;
        if (input.GetAction(InputAction.BOOST) && (_boostCooldown.IsRunning == false || _boostCooldown.Expired(Runner)))
        {
            if (Object.HasInputAuthority)
            {
                RpcStartBoost();
            }
            speed += _boostFactor;
            _boostCooldown = TickTimer.CreateFromSeconds(Runner, _boostCooldownInSeconds);
        }

        if (input.GetAction(InputAction.JUMP) && _isGrounded)
        {
            // _body.AddForce(_body.transform.rotation * Vector3.down * jumpSpeed);
            _body.AddForce(jump * jumpForce, ForceMode.Impulse);
            _isGrounded = false;
        }

        // if (isGrounded)
        // {
        if (input.GetState(InputState.FORWARD))
        {
            _body.AddForce(_body.transform.rotation * Vector3.forward * speed);
        }
        else if (input.GetState(InputState.BACKWARD))
        {
            _body.AddForce(_body.transform.rotation * Vector3.back * speed);
        }

        if (input.GetState(InputState.LEFT))
        {
            _body.AddForce(_body.transform.rotation * Vector3.left * speed);
        }
        else if (input.GetState(InputState.RIGHT))
        {
            _body.AddForce(_body.transform.rotation * Vector3.right * speed);
        }
        // }
    }

    void UpdateActions(InputData input)
    {
        if (input.GetAction(InputAction.FIRE))
        {
            if (Object.HasInputAuthority)
            {
                RpcFireWeapon(Runner.LocalPlayer, _camera.transform.position, _camera.transform.forward);
            }
        }
    }

    void UpdateRespawn(InputData input)
    {
        if (transform.position.y < -10f || input.GetAction(InputAction.RESPAWN))
        {
            Vector3 respawnPoint = Vector3.up * 3f;
            transform.position = respawnPoint;
            _body.position = respawnPoint;
            _body.velocity = Vector3.zero;
            _body.angularVelocity = Vector3.zero;
        }
    }

    void UpdateSpawn(InputData input)
    {
        if (input.GetAction(InputAction.SPAWN))
            Runner.Spawn(_cubePrefab, transform.position + Vector3.up, transform.rotation);
    }

    [Rpc(RpcSources.InputAuthority, RpcTargets.All, Channel = RpcChannel.Unreliable)]
    void RpcStartBoost()
    {
        _boostAnim.StartBoostAnimation();
    }

    [Rpc(RpcSources.InputAuthority, RpcTargets.All, Channel = RpcChannel.Unreliable)]
    void RpcRotatePlayerAndGun(PlayerRef playerRef, Vector3 rotationX, Vector3 rotationY)
    {
        transform.Rotate(rotationX);
        _gunTransform.Rotate(rotationY);
    }


    [Rpc(RpcSources.InputAuthority, RpcTargets.All, Channel = RpcChannel.Unreliable)]
    void RpcFireWeapon(PlayerRef shooterRef, Vector3 shooterCameraPosition, Vector3 shooterCameraDirection)
    {
        Vector3 startPosition = shooterCameraPosition;
        Vector3 direction = shooterCameraDirection;
        Vector3 stopPostion = direction * shotDistance;

        if (Object.HasStateAuthority)
        {
            bool hit = Runner.LagCompensation.Raycast(startPosition, direction, shotDistance, shooterRef, out LagCompensatedHit hitPoint, Physics.DefaultRaycastLayers, HitOptions.IncludePhysX);
            if (hit)
            {
                stopPostion = hitPoint.Point;
                try
                {
                    if (hitPoint.Hitbox != null)
                    {
                        NetworkObject netobj = hitPoint.Hitbox.Root.Object;
                        if (!(netobj != null && Object != null && netobj.InputAuthority == Object.InputAuthority))
                        {
                            MarbleController playerController = netobj.GetComponentInChildren<MarbleController>();
                            playerController.TakeDamage(10.0f);
                        }
                    }
                    else
                    {
                        Rigidbody hitRb = hitPoint.GameObject.transform.parent.GetComponent<Rigidbody>();
                        hitRb.AddForce(direction * 250f);
                    }

                }
                catch (MissingComponentException e)
                {
                    print("Couldn't find thing that we hit. Maybe hit the floor? Moving on...");
                }
            }
        }

        // set the color of the line
        lineRenderer.startColor = Color.red;
        lineRenderer.endColor = Color.red;

        // set width of the renderer
        lineRenderer.startWidth = 0.01f;
        lineRenderer.endWidth = 0.01f;

        // set the position
        lineRenderer.SetPosition(0, startPosition);
        lineRenderer.SetPosition(1, stopPostion);
    }

    private void OnDrawGizmosSelected()
    {
        Gizmos.DrawWireSphere(transform.position, _areaOfInterestRadius);
    }

    void OnCollisionStay()
    {
        _isGrounded = true;
    }


    [Rpc(RpcSources.StateAuthority, RpcTargets.All, Channel = RpcChannel.Reliable)]
    void TakeDamage(float damage)
    {
        health -= damage;
    }
}
